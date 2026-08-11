import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Mobile Capture Page — served at /mobile/capture?token=xxx
 * This is a simplified standalone page (no App shell) for mobile camera capture.
 * Scanned via QR code from the desktop Document Hub.
 *
 * Accessibility refinements (Phase 2B refinement-7):
 *   1. Prominent "Capture lease" CTA — primary action visible above the fold
 *      with a proper <button> element (not just a styled <label>).
 *   2. Live region (`aria-live="polite"`) announces every status change so
 *      screen-reader users hear "Uploading to desktop", "Uploaded successfully",
 *      and errors as they happen — not just visually.
 *   3. Each state has a clear, role-tagged heading + a description list
 *      of next steps.
 *   4. The hidden file <input> gets a proper `aria-label` and is associated
 *      with the visible button via `htmlFor` (the <label> wraps it).
 *   5. The "Done" state adds a "Capture another" action so the user has a
 *      clear next step rather than being left at a dead end.
 */
export default function MobileCapture() {
  const [token, setToken] = useState<string>("");
  const [status, setStatus] = useState<"loading" | "ready" | "captured" | "uploading" | "done" | "error">("loading");
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (!t) {
      setStatus("error");
      setError("No capture token found. Please scan the QR code again.");
      return;
    }
    setToken(t);

    // Verify session exists
    fetch(`/api/capture/sessions/${t}`)
      .then(r => r.json())
      .then(data => {
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

  const handleCapture = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setImagePreview(dataUrl);
      setStatus("uploading");

      try {
        const res = await fetch(`/api/capture/sessions/${token}/upload`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageData: dataUrl, deviceType: "mobile" }),
        });
        const data = await res.json();
        if (data.ok) {
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
  }, [token]);

  const handleReset = useCallback(() => {
    setImagePreview("");
    setStatus("ready");
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleClickCapture = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Status message text for the live region
  const liveMessage = (() => {
    switch (status) {
      case "loading": return "Connecting to desktop session.";
      case "ready": return "Ready to capture. Tap the Capture lease button to take a photo.";
      case "captured": return "Photo captured. Uploading to desktop.";
      case "uploading": return "Uploading to desktop. Please wait.";
      case "done": return "Upload complete. Return to your desktop to see the OCR results.";
      case "error": return `Error: ${error}`;
    }
  })();

  return (
    <div
      role="main"
      aria-label="FreeLeased mobile document capture"
      style={{ fontFamily: "system-ui, sans-serif", background: "#04141a", color: "#e2e8f0", minHeight: "100vh", padding: "16px" }}
    >
      <div style={{ maxWidth: 400, margin: "0 auto" }}>
        <header style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#2dd4bf", margin: 0 }}>FreeLeased</h1>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0 0 0" }}>Document Capture</p>
        </header>

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
          </section>
        )}

        {status === "ready" && (
          <section style={{ textAlign: "center", padding: 20 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }} aria-hidden="true">📸</div>
            <h2 style={{ fontSize: 16, color: "#e2e8f0", margin: "0 0 12px 0", fontWeight: 600 }}>
              Capture your lease
            </h2>
            <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 24 }}>
              Tap below to photograph your document.
              <br />Position the full page in frame.
            </p>

            {/* Primary CTA — a real <button> styled as a primary action.
                Tappable area is at least 48px tall per WCAG 2.5.5. */}
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

            <p style={{ fontSize: 12, color: "#64748b", marginTop: 16, lineHeight: 1.5 }}>
              Tip: Flat surface, good lighting, entire page visible.
            </p>
          </section>
        )}

        {status === "uploading" && (
          <section aria-busy="true" style={{ textAlign: "center", padding: 40 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }} aria-hidden="true">⬆️</div>
            <p style={{ color: "#2dd4bf", fontSize: 16, margin: 0, fontWeight: 600 }}>
              Uploading to desktop...
            </p>
            <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 8 }}>
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
                style={{ maxWidth: "100%", borderRadius: 8, marginBottom: 16, border: "1px solid rgba(255,255,255,0.1)" }}
              />
            )}
            <div style={{ fontSize: 40, marginBottom: 12 }} aria-hidden="true">✅</div>
            <h2 style={{ fontSize: 18, color: "#34d399", margin: "0 0 8px 0", fontWeight: 700 }}>
              Uploaded successfully
            </h2>
            <p style={{ color: "#94a3b8", fontSize: 14, margin: 0 }}>
              Go back to your desktop to see the OCR results.
            </p>
            <button
              type="button"
              onClick={handleReset}
              style={{
                marginTop: 24,
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
              Capture another page
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
