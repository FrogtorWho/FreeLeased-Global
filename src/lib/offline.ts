// Offline-First Architecture — works without internet.
//
// Deterministic engines run locally. SLM runs locally when available (Ollama).
// LLM calls queue and sync when connected. Vector DB syncs incrementally.
// This is the accessibility layer that makes FreeLeased work on $50 Android phones
// in low-bandwidth Caribbean environments.
//
// Design principles:
// 1. Deterministic engines work without any network
// 2. SLM runs locally when Ollama is available
// 3. LLM calls queue and execute when online
// 4. Data syncs incrementally (delta, not full)
// 5. Conflict resolution for concurrent edits

// ── Connection Status ─────────────────────────────────────────────

export type ConnectionStatus = "online" | "offline" | "limited";

export interface NetworkState {
  status: ConnectionStatus;
  lastOnline: Date | null;
  lastSync: Date | null;
  pendingSync: number; // queued operations
  bandwidth: "high" | "medium" | "low" | "unknown";
}

// ── Offline Queue ─────────────────────────────────────────────────

export type QueueAction =
  | "create"
  | "update"
  | "delete"
  | "sync"
  | "llm_call"
  | "vlm_call";

export interface QueueItem {
  id: string;
  action: QueueAction;
  endpoint: string;
  method: string;
  body: Record<string, unknown>;
  createdAt: Date;
  retries: number;
  maxRetries: number;
  status: "pending" | "processing" | "completed" | "failed";
  error?: string;
}

// ── Service Worker Registration ───────────────────────────────────

/**
 * Register service worker for offline caching.
 * In production, this caches deterministic engines and static assets.
 */
export async function registerServiceWorker(): Promise<boolean> {
  if (typeof window === "undefined" || !("serviceWorker" in window)) {
    return false;
  }

  try {
    const registration = await window.navigator.serviceWorker.register("/sw.js");
    console.log("Service Worker registered:", registration.scope);
    return true;
  } catch (error) {
    console.error("Service Worker registration failed:", error);
    return false;
  }
}

// ── Offline Queue Manager ─────────────────────────────────────────

export class OfflineQueue {
  private queue: QueueItem[] = [];
  private storageKey = "freeleased_offline_queue";

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Add an operation to the offline queue.
   */
  enqueue(
    action: QueueAction,
    endpoint: string,
    method: string,
    body: Record<string, unknown>,
  ): QueueItem {
    const item: QueueItem = {
      id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      action,
      endpoint,
      method,
      body,
      createdAt: new Date(),
      retries: 0,
      maxRetries: 3,
      status: "pending",
    };

    this.queue.push(item);
    this.saveToStorage();
    return item;
  }

  /**
   * Process queued operations when online.
   */
  async processQueue(): Promise<{ processed: number; failed: number }> {
    let processed = 0;
    let failed = 0;

    for (const item of this.queue.filter(i => i.status === "pending")) {
      try {
        item.status = "processing";
        await this.executeItem(item);
        item.status = "completed";
        processed++;
      } catch (error) {
        item.retries++;
        item.error = error instanceof Error ? error.message : String(error);

        if (item.retries >= item.maxRetries) {
          item.status = "failed";
          failed++;
        } else {
          item.status = "pending"; // Retry later
        }
      }
    }

    // Remove completed items
    this.queue = this.queue.filter(i => i.status !== "completed");
    this.saveToStorage();

    return { processed, failed };
  }

  /**
   * Execute a single queue item.
   */
  private async executeItem(item: QueueItem): Promise<void> {
    const response = await fetch(item.endpoint, {
      method: item.method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item.body),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  /**
   * Get queue status.
   */
  getStatus(): {
    pending: number;
    processing: number;
    failed: number;
    total: number;
  } {
    return {
      pending: this.queue.filter(i => i.status === "pending").length,
      processing: this.queue.filter(i => i.status === "processing").length,
      failed: this.queue.filter(i => i.status === "failed").length,
      total: this.queue.length,
    };
  }

  /**
   * Clear failed items.
   */
  clearFailed(): void {
    this.queue = this.queue.filter(i => i.status !== "failed");
    this.saveToStorage();
  }

  /**
   * Save queue to localStorage.
   */
  private saveToStorage(): void {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(this.storageKey, JSON.stringify(this.queue));
    }
  }

  /**
   * Load queue from localStorage.
   */
  private loadFromStorage(): void {
    if (typeof localStorage !== "undefined") {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        try {
          this.queue = JSON.parse(stored);
        } catch {
          this.queue = [];
        }
      }
    }
  }
}

// ── Local Data Store ──────────────────────────────────────────────

export interface LocalData {
  id: string;
  type: string;
  data: Record<string, unknown>;
  version: number;
  lastModified: Date;
  synced: boolean;
}

/**
 * Local-first data store using localStorage/IndexedDB.
 * Deterministic engines read from here when offline.
 */
export class LocalDataStore {
  private storageKey = "freeleased_local_data";
  private data: Map<string, LocalData> = new Map();

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Store data locally.
   */
  set(id: string, type: string, data: Record<string, unknown>): void {
    const existing = this.data.get(id);
    const version = existing ? existing.version + 1 : 1;

    this.data.set(id, {
      id,
      type,
      data,
      version,
      lastModified: new Date(),
      synced: false,
    });

    this.saveToStorage();
  }

  /**
   * Retrieve data locally.
   */
  get(id: string): LocalData | null {
    return this.data.get(id) ?? null;
  }

  /**
   * Get all data of a type.
   */
  getByType(type: string): LocalData[] {
    return Array.from(this.data.values()).filter(d => d.type === type);
  }

  /**
   * Get unsynced data.
   */
  getUnsynced(): LocalData[] {
    return Array.from(this.data.values()).filter(d => !d.synced);
  }

  /**
   * Mark data as synced.
   */
  markSynced(id: string): void {
    const item = this.data.get(id);
    if (item) {
      item.synced = true;
      this.saveToStorage();
    }
  }

  /**
   * Get storage stats.
   */
  getStats(): {
    totalItems: number;
    unsyncedItems: number;
    byType: Record<string, number>;
  } {
    const items = Array.from(this.data.values());
    const byType: Record<string, number> = {};

    for (const item of items) {
      byType[item.type] = (byType[item.type] ?? 0) + 1;
    }

    return {
      totalItems: items.length,
      unsyncedItems: items.filter(i => !i.synced).length,
      byType,
    };
  }

  /**
   * Save to localStorage.
   */
  private saveToStorage(): void {
    if (typeof localStorage !== "undefined") {
      const data = Array.from(this.data.values());
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
  }

  /**
   * Load from localStorage.
   */
  private loadFromStorage(): void {
    if (typeof localStorage !== "undefined") {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        try {
          const items: LocalData[] = JSON.parse(stored);
          for (const item of items) {
            this.data.set(item.id, item);
          }
        } catch {
          this.data.clear();
        }
      }
    }
  }
}

// ── Conflict Resolution ───────────────────────────────────────────

export interface Conflict {
  id: string;
  localVersion: LocalData;
  remoteVersion: Record<string, unknown>;
  resolution?: "local" | "remote" | "merge";
}

/**
 * Resolve conflicts between local and remote data.
 * Default: last-write-wins (remote wins for simplicity).
 */
export function resolveConflict(
  local: LocalData,
  remote: Record<string, unknown>,
  strategy: "local" | "remote" | "merge" = "remote",
): Record<string, unknown> {
  switch (strategy) {
    case "local":
      return local.data;
    case "remote":
      return remote;
    case "merge":
      // Simple merge: remote wins for conflicting fields, local for non-conflicting
      return { ...local.data, ...remote };
    default:
      return remote;
  }
}

// ── Network Detection ─────────────────────────────────────────────

/**
 * Subset of the Network Information API (Chromium-only, opt-in).
 * We narrow the navigator with a typed accessor instead of `any`.
 */
interface NetworkInformation {
  readonly effectiveType?: "2g" | "3g" | "4g" | "slow-2g";
  readonly downlink?: number;
  readonly rtt?: number;
  readonly saveData?: boolean;
}

interface NavigatorWithConnection extends Navigator {
  readonly connection?: NetworkInformation;
}

/**
 * Detect network status and bandwidth.
 */
export function detectNetworkStatus(): NetworkState {
  if (typeof navigator === "undefined") {
    return {
      status: "online",
      lastOnline: new Date(),
      lastSync: new Date(),
      pendingSync: 0,
      bandwidth: "unknown",
    };
  }

  const online = navigator.onLine;
  const connection = (navigator as NavigatorWithConnection).connection;

  let bandwidth: NetworkState["bandwidth"] = "unknown";
  if (connection) {
    const effectiveType = connection.effectiveType;
    if (effectiveType === "4g") bandwidth = "high";
    else if (effectiveType === "3g") bandwidth = "medium";
    else bandwidth = "low";
  }

  return {
    status: online ? "online" : "offline",
    lastOnline: online ? new Date() : null,
    lastSync: null,
    pendingSync: 0,
    bandwidth,
  };
}
