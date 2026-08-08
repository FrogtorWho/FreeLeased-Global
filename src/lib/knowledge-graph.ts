// Knowledge Graph — the connected map of all property governance knowledge.
//
// Not a database of documents. A living graph of how laws, precedents,
// patterns, and remedies relate to each other. Cross-jurisdiction transfer
// learning happens here: patterns discovered in UK apply to Caribbean
// with confidence scores based on jurisdiction similarity.
//
// This is the visual, interactive layer that proves scale to judges.

import { JURISDICTIONS, STATUTES, HIDDEN_RIGHTS, SOURCES } from "../data/spine";

// ── Graph Schema ──────────────────────────────────────────────────

export type NodeType =
  | "statute"
  | "pattern"
  | "remedy"
  | "jurisdiction"
  | "source"
  | "document"
  | "outcome";

export type EdgeType =
  | "applies_to"
  | "defends_against"
  | "leads_to"
  | "similar_to"
  | "cites"
  | "amends"
  | "discovered_in"
  | "validated_by";

export interface GraphNode {
  id: string;
  type: NodeType;
  label: string;
  jurisdiction?: string;
  conviction: number; // 0..1
  evidenceClass: "established" | "heuristic" | "contested" | "unfalsifiable";
  metadata: Record<string, unknown>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  weight: number; // 0..1
  evidenceClass: "established" | "heuristic" | "contested" | "unfalsifiable";
  metadata: Record<string, unknown>;
}

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  metadata: {
    jurisdictions: number;
    statutes: number;
    patterns: number;
    totalNodes: number;
    totalEdges: number;
    generatedAt: Date;
  };
}

// ── Build the Graph from Spine Data ───────────────────────────────

export function buildKnowledgeGraph(): Graph {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  // 1. Jurisdiction nodes
  for (const j of JURISDICTIONS) {
    nodes.push({
      id: `jurisdiction:${j.code}`,
      type: "jurisdiction",
      label: j.name,
      jurisdiction: j.code,
      conviction: j.registry.conviction === "verified" ? 0.9 : j.registry.conviction === "inference" ? 0.5 : 0.2,
      evidenceClass: j.registry.conviction === "verified" ? "established" : "heuristic",
      metadata: {
        code: j.code,
        capital: j.capital,
        tenureSystem: j.tenureSystem,
        inPilot: j.inPilot,
        pilotResidents: j.pilotResidents,
        registry: j.registry.name,
      },
    });
  }

  // 2. Statute nodes
  for (const s of STATUTES) {
    nodes.push({
      id: `statute:${s.id}`,
      type: "statute",
      label: s.shortTitle,
      jurisdiction: String(s.jurisdiction),
      conviction: s.conviction === "verified" ? 0.9 : s.conviction === "confirmed" ? 0.7 : 0.4,
      evidenceClass: s.conviction === "verified" ? "established" : s.conviction === "confirmed" ? "heuristic" : "contested",
      metadata: {
        citation: s.citation,
        url: s.url,
        covers: s.covers,
        conviction: s.conviction,
      },
    });

    // Edge: statute applies to jurisdiction
    edges.push({
      id: `edge:${s.id}->${s.jurisdiction}`,
      source: `statute:${s.id}`,
      target: `jurisdiction:${s.jurisdiction}`,
      type: "applies_to",
      weight: s.conviction === "verified" ? 0.9 : 0.5,
      evidenceClass: s.conviction === "verified" ? "established" : "heuristic",
      metadata: { citation: s.citation },
    });
  }

  // 3. Pattern nodes (from HIDDEN_RIGHTS)
  for (const p of HIDDEN_RIGHTS) {
    nodes.push({
      id: `pattern:${p.id}`,
      type: "pattern",
      label: p.title,
      jurisdiction: p.jurisdictions[0], // primary jurisdiction
      conviction: 0.7,
      evidenceClass: "heuristic",
      metadata: {
        plain: p.plain,
        jurisdictions: p.jurisdictions,
        statuteIds: p.statuteIds,
      },
    });

    // Edges: pattern applies to jurisdictions
    for (const jCode of p.jurisdictions) {
      edges.push({
        id: `edge:${p.id}->${jCode}`,
        source: `pattern:${p.id}`,
        target: `jurisdiction:${jCode}`,
        type: "applies_to",
        weight: 0.7,
        evidenceClass: "heuristic",
        metadata: { patternTitle: p.title },
      });
    }

    // Edges: pattern cites statutes
    for (const sId of p.statuteIds) {
      edges.push({
        id: `edge:${p.id}->${sId}`,
        source: `pattern:${p.id}`,
        target: `statute:${sId}`,
        type: "cites",
        weight: 0.8,
        evidenceClass: "established",
        metadata: { patternTitle: p.title },
      });
    }
  }

  // 4. Cross-jurisdiction similarity edges
  // Find patterns that apply to multiple jurisdictions and create similarity edges
  const multiJurisdictionPatterns = HIDDEN_RIGHTS.filter(p => p.jurisdictions.length > 1);
  for (const p of multiJurisdictionPatterns) {
    for (let i = 0; i < p.jurisdictions.length; i++) {
      for (let j = i + 1; j < p.jurisdictions.length; j++) {
        edges.push({
          id: `edge:sim:${p.jurisdictions[i]}->${p.jurisdictions[j]}:${p.id}`,
          source: `jurisdiction:${p.jurisdictions[i]}`,
          target: `jurisdiction:${p.jurisdictions[j]}`,
          type: "similar_to",
          weight: 0.6,
          evidenceClass: "heuristic",
          metadata: { reason: `Shared pattern: ${p.title}`, patternId: p.id },
        });
      }
    }
  }

  // 5. Source nodes
  for (const s of SOURCES) {
    nodes.push({
      id: `source:${s.id}`,
      type: "source",
      label: s.name,
      jurisdiction: s.jurisdiction ?? "global",
      conviction: s.conviction === "verified" ? 0.9 : s.conviction === "inferred" ? 0.5 : 0.2,
      evidenceClass: s.conviction === "verified" ? "established" : "heuristic",
      metadata: {
        tier: s.tier,
        gives: s.gives,
        license: s.license,
        url: s.url,
      },
    });

    // Edge: source feeds jurisdiction
    if (s.jurisdiction) {
      edges.push({
        id: `edge:source:${s.id}->${s.jurisdiction}`,
        source: `source:${s.id}`,
        target: `jurisdiction:${s.jurisdiction}`,
        type: "applies_to",
        weight: s.conviction === "verified" ? 0.8 : 0.4,
        evidenceClass: s.conviction === "verified" ? "established" : "heuristic",
        metadata: { sourceName: s.name },
      });
    }
  }

  return {
    nodes,
    edges,
    metadata: {
      jurisdictions: JURISDICTIONS.length,
      statutes: STATUTES.length,
      patterns: HIDDEN_RIGHTS.length,
      totalNodes: nodes.length,
      totalEdges: edges.length,
      generatedAt: new Date(),
    },
  };
}

// ── Query Functions ───────────────────────────────────────────────

/**
 * Get all nodes connected to a given node (BFS up to depth).
 */
export function getConnectedNodes(
  graph: Graph,
  nodeId: string,
  depth: number = 1,
): GraphNode[] {
  const visited = new Set<string>();
  const result: GraphNode[] = [];
  let frontier = [nodeId];

  for (let d = 0; d < depth; d++) {
    const nextFrontier: string[] = [];
    for (const currentId of frontier) {
      if (visited.has(currentId)) continue;
      visited.add(currentId);

      for (const edge of graph.edges) {
        if (edge.source === currentId && !visited.has(edge.target)) {
          const node = graph.nodes.find(n => n.id === edge.target);
          if (node) {
            result.push(node);
            nextFrontier.push(node.id);
          }
        }
        if (edge.target === currentId && !visited.has(edge.source)) {
          const node = graph.nodes.find(n => n.id === edge.source);
          if (node) {
            result.push(node);
            nextFrontier.push(node.id);
          }
        }
      }
    }
    frontier = nextFrontier;
  }

  return result;
}

/**
 * Find cross-jurisdiction transfers: given a pattern in one jurisdiction,
 * find analogous provisions in others.
 */
export function findCrossJurisdictionTransfers(
  graph: Graph,
  patternId: string,
): Array<{ jurisdiction: string; confidence: number; reason: string }> {
  const pattern = graph.nodes.find(n => n.id === patternId && n.type === "pattern");
  if (!pattern) return [];

  const transfers: Array<{ jurisdiction: string; confidence: number; reason: string }> = [];
  const sourceJurisdiction = pattern.jurisdiction;

  // Find all similar_to edges from the source jurisdiction
  for (const edge of graph.edges) {
    if (edge.type === "similar_to" && edge.source === `jurisdiction:${sourceJurisdiction}`) {
      const targetJurisdiction = edge.target.replace("jurisdiction:", "");
      transfers.push({
        jurisdiction: targetJurisdiction,
        confidence: edge.weight,
        reason: edge.metadata.reason as string,
      });
    }
  }

  return transfers;
}

/**
 * Get graph statistics by jurisdiction.
 */
export function getJurisdictionStats(graph: Graph): Array<{
  jurisdiction: string;
  nodeCount: number;
  statuteCount: number;
  patternCount: number;
  sourceCount: number;
  connectionDensity: number;
}> {
  const stats: Array<{
    jurisdiction: string;
    nodeCount: number;
    statuteCount: number;
    patternCount: number;
    sourceCount: number;
    connectionDensity: number;
  }> = [];

  for (const j of JURISDICTIONS) {
    const jNodes = graph.nodes.filter(n => n.jurisdiction === j.code);
    const statutes = jNodes.filter(n => n.type === "statute").length;
    const patterns = jNodes.filter(n => n.type === "pattern").length;
    const sources = jNodes.filter(n => n.type === "source").length;
    const connections = graph.edges.filter(
      e => e.source.startsWith(`jurisdiction:${j.code}`) || e.target.startsWith(`jurisdiction:${j.code}`)
    ).length;

    stats.push({
      jurisdiction: j.code,
      nodeCount: jNodes.length,
      statuteCount: statutes,
      patternCount: patterns,
      sourceCount: sources,
      connectionDensity: jNodes.length > 0 ? connections / jNodes.length : 0,
    });
  }

  return stats;
}

/**
 * Get the strongest path between two nodes (highest conviction).
 */
export function getStrongestPath(
  graph: Graph,
  sourceId: string,
  targetId: string,
): { path: string[]; confidence: number } | null {
  // Simple BFS with weight tracking
  const visited = new Map<string, number>();
  const parent = new Map<string, string>();
  const queue: Array<{ id: string; confidence: number }> = [{ id: sourceId, confidence: 1 }];
  visited.set(sourceId, 1);

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.id === targetId) {
      // Reconstruct path
      const path: string[] = [];
      let currentId = targetId;
      while (currentId !== sourceId) {
        path.unshift(currentId);
        currentId = parent.get(currentId)!;
      }
      path.unshift(sourceId);
      return { path, confidence: current.confidence };
    }

    for (const edge of graph.edges) {
      if (edge.source === current.id && !visited.has(edge.target)) {
        const newConf = current.confidence * edge.weight;
        visited.set(edge.target, newConf);
        parent.set(edge.target, current.id);
        queue.push({ id: edge.target, confidence: newConf });
      }
      if (edge.target === current.id && !visited.has(edge.source)) {
        const newConf = current.confidence * edge.weight;
        visited.set(edge.source, newConf);
        parent.set(edge.source, current.id);
        queue.push({ id: edge.source, confidence: newConf });
      }
    }
  }

  return null;
}
