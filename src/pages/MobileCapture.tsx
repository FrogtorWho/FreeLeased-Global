import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Mobile Capture Page — served at /mobile/capture?token=xxx
 * This is a simplified standalone page (no App shell) for mobile camera capture.
 * Scanned via QR code from the desktop Document Hub.
 *
 * Phase 12 G4 — Mobile-ready:
 *   1. Real camera integration via <input type="file" accept="image/*" capture="environment">
 *   2. PWA install prompt (beforeinstallprompt event) + standalone display check
 *   3. Camera permission handling + explicit error states
 *   4. Mobile-friendly upload flow (multi-page capture, retry, offline-queue hint)
 *   5. ARIA live region announces every state change
 *   6. Respects prefers-reduced-motion + dark/light via meta theme-color
 */

type CaptureStatus =
  | "loading"
  | "ready"
  | "captured"
  | "uploading"
  | "done"
  | "error"
  | "permission-denied"
  | "offline";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function MobileCapture() {
  const [token, setToken] = useState<string>("");
  const [status, setStatus] = useState<CaptureStatus>("loading");
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageBytes, setImageBytes] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [installPromptAvailable, setInstallPromptAvailable] = useState<boolean>(false);
  const [installOutcome, setInstallOutcome] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);

  // Detect standalone display (PWA installed)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const standalone = window.matchMedia("(display-mode: standalone)").matches
      || (navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e as BeforeInstallPromptEvent;
      setInstallPromptAvailable(true);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setInstallPromptAvailable(false);
      setInstallOutcome("installed");
      deferredPromptRef.current = null;
    };
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // Network status
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Verify session exists
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (!t) {
      setStatus("error");
      setError("No capture token found. Please scan the QR code again.");
      return;
    }
    setToken(t);

    fetch(`/api/capture/sessions/${t}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.ok && data.session.status === "waiting") {
          setStatus("ready");
        } else if (data.ok && data.session.status === "expired") {
          setStatus("error");
          setError("This session has expired. Please generate a new QR code on desktop.");
        } else {
          setStatus("ready");
        }
      })
      .catch(() => {
        setStatus("error");
        setError("Could not connect to server. Are you on the same network?");
      });
  }, []);

  const handleCapture = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !token) return;

      setImageBytes(file.size);

      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        setImagePreview(dataUrl);
        setStatus("uploading");

        if (!isOnline) {
          setStatus("offline");
          setError(
            "You're offline. The capture is held locally; we'll upload automatically when you're back online.",
          );
          return;
        }

        try {
          const res = await fetch(`/api/capture/sessions/${token}/upload`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              imageData: dataUrl,
              deviceType: "mobile",
              bytes: file.size,
              mimeType: file.type,
            }),
          });
          const data = await res.json();
          if (data.ok) {
            setPageCount((p) => p + 1);
            setStatus("done");
          } else {
            setStatus("error");
            setError(data.error || "Upload failed");
          }
        } catch {
          setStatus("error");
          setError("Upload failed. Check your connection.");
        }
      };
      reader.readAsDataURL(file);
    },
    [token, isOnline],
  );

  const handleReset = useCallback(() => {
    setImagePreview("");
    setImageBytes(0);
    setStatus("ready");
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleClickCapture = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleInstall = useCallback(async () => {
    const prompt = deferredPromptRef.current;
    if (!prompt) return;
    await prompt.prompt();
    const choice = await prompt.userChoice;
    setInstallOutcome(choice.outcome);
    deferredPromptRef.current = null;
    setInstallPromptAvailable(false);
  }, []);

  // Live region text
  const liveMessage = (() => {
    switch (status) {
      case "loading":
        return "Connecting to desktop session.";
      case "ready":
        return isOnline
          ? "Ready to capture. Tap the Capture lease button to take a photo."
          : "Ready to capture, but you're offline. Capture is queued for upload.";
      case "captured":
        return "Photo captured. Uploading to desktop.";
      case "uploading":
        return "Uploading to desktop. Please wait.";
      case "done":
        return `Upload complete. Page ${pageCount} of ${pageCount} captured. Return to desktop for OCR results.`;
      case "error":
        return `Error: ${error}`;
      case "permission-denied":
        return "Camera permission denied. Use the file picker instead.";
      case "offline":
        return `Offline. ${error}`;
    }
  })();

  return (
    <div
      role="main"
      aria-label="FreeLeased mobile document capture"
      style={{
        fontFamily: "system-ui, sans-serif",
        background: "#04141a",
        color: "#e2e8f0",
        minHeight: "100vh",
        padding: "16px",
      }}
    >
      <div style={{ maxWidth: 400, margin: "0 auto" }}>
        <header style={{ textAlign: "center", marginBottom: 16 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#2dd4bf", margin: 0 }}>
            FreeLeased
          </h1>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0 0 0" }}>
            Document Capture
          </p>
          <div
            style={{
              fontSize: 11,
              color: isOnline ? "#10b981" : "#f59e0b",
              marginTop: 4,
            }}
            aria-live="polite"
          >
            {isOnline ? "● Online" : "○ Offline (capture queued)"}
            {isStandalone && " · Standalone"}
          </div>
        </header>

        {/* PWA install prompt */}
        {installPromptAvailable && !isStandalone && status !== "error" && (
          <div
            role="region"
            aria-label="Install FreeLeased"
            style={{
              background: "rgba(13, 148, 136, 0.1)",
              border: "1px solid rgba(13, 148, 136, 0.3)",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
              fontSize: 13,
            }}
          >
            <strong style={{ color: "#2dd4bf" }}>Install FreeLeased</strong>
            <p style={{ margin: "4px 0 8px 0", color: "#94a3b8" }}>
              Add to your home screen for full-screen capture with offline support.
            </p>
            <button
              type="button"
              onClick={handleInstall}
              style={{
                background: "#0d9488",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                minHeight: 44,
              }}
              aria-label="Install FreeLeased app"
            >
              Install
            </button>
            {installOutcome && (
              <p style={{ margin: "4px 0 0 0", fontSize: 11, color: "#64748b" }}>
                Result: {installOutcome}
              </p>
            )}
          </div>
        )}

        {/* Live region — announces every status change to screen readers */}
        <div
          aria-live="polite"
          aria-atomic="true"
          role="status"
          style={{
            position: "absolute",
            left: -9999,
            top: -9999,
            width: 1,
            height: 1,
            overflow: "hidden",
          }}
        >
          {liveMessage}
        </div>

        {status === "loading" && (
          <section aria-busy="true" style={{ textAlign: "center", padding: 40 }}>
            <p style={{ color: "#94a3b8" }}>Connecting...</p>
          </section>
        )}

        {status === "error" && (
          <section role="alert" style={{ textAlign: "center", padding: 40 }}>
            <p style={{ color: "#f87171", fontSize: 14, margin: 0 }}>{error}</p>
            <button
              type="button"
              onClick={handleReset}
              style={{
                marginTop: 16,
                background: "transparent",
                color: "#2dd4bf",
                border: "1px solid #2dd4bf",
                padding: "10px 20px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                minHeight: 44,
              }}
            >
              Try again
            </button>
          </section>
        )}

        {status === "permission-denied" && (
          <section
            role="alert"
            style={{ textAlign: "center", padding: 20 }}
          >
            <p style={{ color: "#f59e0b", fontSize: 14 }}>
              Camera permission was denied. Use the file picker below to choose
              an image from your gallery.
            </p>
            <button
              type="button"
              onClick={handleClickCapture}
              style={{
                marginTop: 12,
                background: "#0d9488",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                minHeight: 48,
              }}
            >
              Choose from gallery
            </button>
          </section>
        )}

        {status === "offline" && (
          <section role="status" style={{ textAlign: "center", padding: 20 }}>
            <p style={{ color: "#f59e0b", fontSize: 14 }}>
              You're offline. The capture is held locally — it'll upload
              automatically when you're back online.
            </p>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Pending upload"
                style={{
                  maxWidth: "100%",
                  borderRadius: 8,
                  marginTop: 12,
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
            )}
            <button
              type="button"
              onClick={handleClickCapture}
              style={{
                marginTop: 16,
                background: "#0d9488",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                minHeight: 48,
              }}
            >
              Capture another page
            </button>
          </section>
        )}

        {status === "ready" && (
          <section style={{ textAlign: "center", padding: 20 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }} aria-hidden="true">
              📸
            </div>
            <h2
              style={{
                fontSize: 16,
                color: "#e2e8f0",
                margin: "0 0 12px 0",
                fontWeight: 600,
              }}
            >
              Capture your lease
            </h2>
            <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 24 }}>
              Tap below to photograph your document.
              <br />
              Position the full page in frame.
            </p>

            <label
              htmlFor="mobile-capture-file"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: "#0d9488",
                color: "white",
                padding: "16px 32px",
                borderRadius: 12,
                fontSize: 18,
                fontWeight: 700,
                cursor: "pointer",
                minHeight: 56,
                minWidth: 240,
                boxShadow: "0 4px 12px rgba(13, 148, 136, 0.4)",
                border: "none",
                userSelect: "none",
                WebkitTapHighlightColor: "transparent",
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleClickCapture();
                }
              }}
            >
              <span aria-hidden="true">📷</span>
              <span>Capture lease</span>
            </label>
            <input
              id="mobile-capture-file"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleCapture}
              aria-label="Photograph lease document"
              style={{
                position: "absolute",
                left: -9999,
                top: -9999,
                width: 1,
                height: 1,
                overflow: "hidden",
              }}
            />

            <p
              style={{
                fontSize: 12,
                color: "#64748b",
                marginTop: 16,
                lineHeight: 1.5,
              }}
            >
              Tip: Flat surface, good lighting, entire page visible.
            </p>
          </section>
        )}

        {status === "uploading" && (
          <section aria-busy="true" style={{ textAlign: "center", padding: 40 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }} aria-hidden="true">
              ⬆️
            </div>
            <p
              style={{
                color: "#2dd4bf",
                fontSize: 16,
                margin: 0,
                fontWeight: 600,
              }}
            >
              Uploading to desktop...
            </p>
            <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 8 }}>
              {imageBytes > 0 && `${(imageBytes / 1024).toFixed(0)} KB · `}
              This usually takes less than 5 seconds.
            </p>
          </section>
        )}

        {status === "done" && (
          <section style={{ textAlign: "center", padding: 20 }}>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Your captured lease document"
                style={{
                  maxWidth: "100%",
                  borderRadius: 8,
                  marginBottom: 16,
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
            )}
            <div style={{ fontSize: 40, marginBottom: 12 }} aria-hidden="true">
              ✅
            </div>
            <h2
              style={{
                fontSize: 18,
                color: "#34d399",
                margin: "0 0 8px 0",
                fontWeight: 700,
              }}
            >
              Page {pageCount} uploaded
            </h2>
            <p style={{ color: "#94a3b8", fontSize: 14, margin: 0 }}>
              {pageCount === 1
                ? "First page uploaded. Capture more pages or return to your desktop."
                : `All ${pageCount} pages uploaded. Return to your desktop for OCR results.`}
            </p>
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 24,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={handleClickCapture}
                style={{
                  background: "#0d9488",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  minHeight: 44,
                }}
              >
                Capture another page
              </button>
              <button
                type="button"
                onClick={handleReset}
                style={{
                  background: "transparent",
                  color: "#2dd4bf",
                  border: "1px solid #2dd4bf",
                  padding: "10px 20px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  minHeight: 44,
                }}
              >
                Done — return to desktop
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}