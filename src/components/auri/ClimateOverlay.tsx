import { useMemo } from "react";
import {
  getCoastalRisk,
  isCoastalJurisdiction,
  RISK_LABELS,
  COASTAL_JURISDICTIONS,
  CLIMATE_OVERLAY_VERSION,
} from "@/lib/climate-overlay";

/**
 * ClimateOverlay — renders the sea-level-rise risk overlay on a dossier.
 *
 * Phase 12 G7. Mounted as a tab inside the dossier view; surfaces the
 * `riskScore` (0–4), the SLR projection horizons (2030/2050/2100), and
 * the leaseholder implication. Renders nothing for non-coastal
 * jurisdictions (e.g. UK) — keeps the dossier view quiet.
 *
 * All numeric values carry an `unverified` flag (rendered as a small
 * disclaimer badge) so the leaseholder can never mistake the overlay
 * for a licensed survey.
 */

interface ClimateOverlayProps {
  jurisdictionCode: string;
  /** Optional inline display mode (compact for the dossier side-panel). */
  compact?: boolean;
}

const RISK_COLOR: Record<number, string> = {
  0: "#10b981", // green
  1: "#84cc16", // lime
  2: "#f59e0b", // amber
  3: "#f97316", // orange
  4: "#ef4444", // red
};

export function ClimateOverlay({ jurisdictionCode, compact = false }: ClimateOverlayProps) {
  const risk = useMemo(() => getCoastalRisk(jurisdictionCode), [jurisdictionCode]);

  if (!isCoastalJurisdiction(jurisdictionCode) || !risk) {
    return null;
  }

  const color = RISK_COLOR[risk.riskScore] ?? "#64748b";
  const label = RISK_LABELS[risk.riskScore] ?? "Unknown";

  if (compact) {
    return (
      <div
        role="region"
        aria-label={`Climate overlay for ${risk.jurisdictionName}`}
        style={{
          border: `1px solid ${color}40`,
          background: `${color}10`,
          borderRadius: 8,
          padding: 12,
          fontSize: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            aria-hidden="true"
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              background: color,
              display: "inline-block",
            }}
          />
          <strong style={{ color }}>Climate risk: {label}</strong>
          <span style={{ color: "#94a3b8" }}>({risk.riskScore}/4)</span>
          {risk.unverified && (
            <span
              style={{
                marginLeft: "auto",
                fontSize: 10,
                color: "#94a3b8",
                fontStyle: "italic",
              }}
              title="All numeric values are approximated from public regional sources; see sources list."
            >
              unverified
            </span>
          )}
        </div>
        <p style={{ color: "#cbd5e1", margin: "6px 0 0 0", lineHeight: 1.4 }}>
          {risk.exposedCoastlinePct}% of coastline exposed by 2100 (SSP2-4.5).
        </p>
      </div>
    );
  }

  return (
    <section
      role="region"
      aria-label={`Climate overlay for ${risk.jurisdictionName}`}
      style={{
        background: "#0f172a",
        border: `1px solid ${color}30`,
        borderRadius: 12,
        padding: 16,
        color: "#e2e8f0",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <header style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <span
          aria-hidden="true"
          style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            background: color,
            display: "inline-block",
          }}
        />
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color }}>
          Sea-Level-Rise Risk — {label}
        </h3>
        {risk.unverified && (
          <span
            style={{
              marginLeft: "auto",
              fontSize: 10,
              color: "#94a3b8",
              background: "#1e293b",
              padding: "2px 8px",
              borderRadius: 12,
              fontStyle: "italic",
            }}
            title="All numeric values are approximated from public regional sources; see sources list at the bottom of this card."
          >
            unverified — screening only
          </span>
        )}
      </header>

      <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.5, margin: "0 0 12px 0" }}>
        {risk.regionalContext}
      </p>

      {/* SLR projections — small bar chart */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
        {risk.horizonYears.map((year) => {
          const metres = risk.projectedSLRMetres[year as 2030 | 2050 | 2100];
          const pct = Math.min(100, (metres / 1.2) * 100);
          return (
            <div
              key={year}
              style={{
                background: "#1e293b",
                padding: 8,
                borderRadius: 6,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 11, color: "#94a3b8" }}>{year}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color }}>
                +{metres.toFixed(2)}m
              </div>
              <div
                aria-hidden="true"
                style={{
                  marginTop: 6,
                  height: 4,
                  borderRadius: 2,
                  background: "#334155",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${pct}%`,
                    height: "100%",
                    background: color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        <Stat label="Coastline exposed" value={`${risk.exposedCoastlinePct}%`} />
        <Stat label="Population exposed" value={`${risk.exposedPopulationPct}%`} />
        <Stat label="Primary hazard" value={risk.primaryHazard} />
        <Stat label="ISO-2 code" value={risk.iso2} />
      </div>

      {/* Leaseholder implication */}
      <div
        style={{
          background: "#1e293b",
          padding: 12,
          borderRadius: 8,
          marginBottom: 12,
        }}
      >
        <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>
          What this means for your lease
        </div>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "#cbd5e1" }}>
          {risk.leaseholderImplication}
        </p>
      </div>

      {/* Sources */}
      <footer
        style={{
          fontSize: 11,
          color: "#64748b",
          borderTop: "1px solid #1e293b",
          paddingTop: 8,
        }}
      >
        <div>
          <strong style={{ color: "#94a3b8" }}>Source dataset:</strong> {risk.sourceDataset}
        </div>
        {risk.url && (
          <div>
            <strong style={{ color: "#94a3b8" }}>More info:</strong>{" "}
            <a
              href={risk.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#2dd4bf", textDecoration: "underline" }}
            >
              {risk.url}
            </a>
          </div>
        )}
        <div style={{ marginTop: 4, fontStyle: "italic" }}>
          Overlay version {CLIMATE_OVERLAY_VERSION} — covers {COASTAL_JURISDICTIONS.length} Caribbean
          jurisdictions. Verify against a licensed surveyor for tribunal-grade matters.
        </div>
      </footer>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "#1e293b", padding: 8, borderRadius: 6 }}>
      <div style={{ fontSize: 11, color: "#94a3b8" }}>{label}</div>
      <div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 600 }}>{value}</div>
    </div>
  );
}

export default ClimateOverlay;