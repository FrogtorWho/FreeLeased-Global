import { useState, useEffect, useCallback } from "react";

/**
 * Mobile Capture Page — served at /mobile/capture?token=xxx
 * This is a simplified standalone page (no App shell) for mobile camera capture.
 * Scanned via QR code from the desktop Document Hub.
 */
export default function MobileCapture() {
  const [token, setToken] = useState<string>("");
  const [status, setStatus] = useState<"loading" | "ready" | "captured" | "uploading" | "done" | "error">("loading");
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");

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

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#04141a", color: "#e2e8f0", minHeight: "100vh", padding: "16px" }}>
      <div style={{ maxWidth: 400, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#2dd4bf" }}>FreeLeased</h1>
          <p style={{ fontSize: 13, color: "#94a3b8" }}>Document Capture</p>
        </div>

        {status === "loading" && (
          <div style={{ textAlign: "center", padding: 40 }}>
            <p style={{ color: "#94a3b8" }}>Connecting...</p>
          </div>
        )}

        {status === "error" && (
          <div style={{ textAlign: "center", padding: 40 }}>
            <p style={{ color: "#f87171", fontSize: 14 }}>{error}</p>
          </div>
        )}

        {status === "ready" && (
          <div style={{ textAlign: "center", padding: 20 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📸</div>
            <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 20 }}>
              Tap below to photograph your document.
              <br />Position the full page in frame.
            </p>
            <label style={{
              display: "inline-block",
              background: "#0d9488",
              color: "white",
              padding: "12px 24px",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
            }}>
              📷 Take Photo
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleCapture}
                style={{ display: "none" }}
              />
            </label>
            <p style={{ fontSize: 11, color: "#64748b", marginTop: 12 }}>
              Tip: Flat surface, good lighting, entire page visible.
            </p>
          </div>
        )}

        {status === "uploading" && (
          <div style={{ textAlign: "center", padding: 40 }}>
            <p style={{ color: "#2dd4bf", fontSize: 14 }}>⬆️ Uploading to desktop...</p>
          </div>
        )}

        {status === "done" && (
          <div style={{ textAlign: "center", padding: 40 }}>
            {imagePreview && (
              <img src={imagePreview} alt="Captured" style={{ maxWidth: "100%", borderRadius: 8, marginBottom: 16, border: "1px solid rgba(255,255,255,0.1)" }} />
            )}
            <p style={{ color: "#34d399", fontSize: 16, fontWeight: 600 }}>✅ Uploaded!</p>
            <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 8 }}>
              Go back to your desktop to see the OCR results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
