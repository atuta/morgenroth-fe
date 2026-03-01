import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "cookie_prefs_v1";

/**
 * Preference shape:
 * {
 *   necessary: true,          // always true
 *   analytics: boolean,
 *   marketing: boolean,
 *   updatedAt: string (ISO)
 * }
 */

export function getCookiePrefs() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;

    return {
      necessary: true,
      analytics: !!parsed.analytics,
      marketing: !!parsed.marketing,
      updatedAt: parsed.updatedAt || null,
    };
  } catch {
    return null;
  }
}

export function hasConsent(category) {
  const prefs = getCookiePrefs();
  if (!prefs) return false;
  if (category === "necessary") return true;
  return !!prefs[category];
}

function savePrefs(prefs) {
  const payload = {
    necessary: true,
    analytics: !!prefs.analytics,
    marketing: !!prefs.marketing,
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  window.dispatchEvent(new CustomEvent("cookie-prefs", { detail: payload }));
  return payload;
}

export default function CookieBanner() {
  const existing = useMemo(() => getCookiePrefs(), []);
  const [open, setOpen] = useState(false);

  // Only show "Save preferences" after user explicitly chooses to customize
  const [expanded, setExpanded] = useState(false);

  // defaults: if existing -> reflect existing, else all off by default
  const [analytics, setAnalytics] = useState(existing ? !!existing.analytics : false);
  const [marketing, setMarketing] = useState(existing ? !!existing.marketing : false);

  useEffect(() => {
    setOpen(existing === null);
  }, [existing]);

  const acceptAll = () => {
    savePrefs({ analytics: true, marketing: true });
    setOpen(false);
  };

  const rejectAll = () => {
    savePrefs({ analytics: false, marketing: false });
    setOpen(false);
  };

  const saveSelection = () => {
    // Only callable when expanded=true (button only exists then)
    savePrefs({ analytics, marketing });
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie preferences"
      style={{
        position: "fixed",
        left: 16,
        right: 16,
        bottom: 16,
        zIndex: 9999,
      }}
    >
      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
          background: "white",
          border: "1px solid rgba(0,0,0,0.12)",
          borderRadius: 14,
          boxShadow: "0 10px 30px rgba(0,0,0,0.14)",
          padding: 16,
        }}
      >
        <div
          style={{ display: "flex", gap: 12, justifyContent: "space-between", flexWrap: "wrap" }}
        >
          <div style={{ minWidth: 260, flex: "1 1 520px" }}>
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>Cookie Preferences</div>
            <div style={{ fontSize: 14, lineHeight: 1.4, color: "rgba(0,0,0,0.75)" }}>
              We use cookies to keep the site running (necessary). With your permission, we also use
              optional cookies to understand usage (analytics) and to improve marketing. You can
              choose what to allow.
            </div>

            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              style={{
                marginTop: 10,
                padding: 0,
                border: "none",
                background: "transparent",
                color: "rgba(0,0,0,0.75)",
                cursor: "pointer",
                textDecoration: "underline",
                fontWeight: 600,
              }}
            >
              {expanded ? "Hide details" : "Customize cookies"}
            </button>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={rejectAll}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.18)",
                background: "transparent",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Reject all
            </button>

            <button
              type="button"
              onClick={acceptAll}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.18)",
                background: "black",
                color: "white",
                cursor: "pointer",
                fontWeight: 800,
              }}
            >
              Accept all
            </button>

            {/* ✅ Only show Save Preferences if user chose to customize */}
            {expanded && (
              <button
                type="button"
                onClick={saveSelection}
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid rgba(0,0,0,0.18)",
                  background: "rgba(0,0,0,0.06)",
                  cursor: "pointer",
                  fontWeight: 800,
                }}
              >
                Save preferences
              </button>
            )}
          </div>
        </div>

        {expanded && (
          <div style={{ marginTop: 14, borderTop: "1px solid rgba(0,0,0,0.10)", paddingTop: 12 }}>
            <div style={{ display: "grid", gap: 10 }}>
              {/* Necessary */}
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  padding: 12,
                  borderRadius: 12,
                  background: "rgba(0,0,0,0.03)",
                }}
              >
                <div style={{ flex: "1 1 auto" }}>
                  <div style={{ fontWeight: 800 }}>Necessary cookies</div>
                  <div style={{ fontSize: 13, color: "rgba(0,0,0,0.70)", marginTop: 4 }}>
                    Required for core features like authentication, security, and saving your
                    session.
                  </div>
                </div>
                <div style={{ fontWeight: 800, color: "rgba(0,0,0,0.70)" }}>Always on</div>
              </div>

              {/* Analytics */}
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  padding: 12,
                  borderRadius: 12,
                  background: "rgba(0,0,0,0.03)",
                }}
              >
                <div style={{ flex: "1 1 auto" }}>
                  <div style={{ fontWeight: 800 }}>Analytics cookies</div>
                  <div style={{ fontSize: 13, color: "rgba(0,0,0,0.70)", marginTop: 4 }}>
                    Helps us understand usage (pages visited, interactions) so we can improve the
                    product.
                  </div>
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                  />
                  <span style={{ fontWeight: 700 }}>{analytics ? "On" : "Off"}</span>
                </label>
              </div>

              {/* Marketing */}
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  padding: 12,
                  borderRadius: 12,
                  background: "rgba(0,0,0,0.03)",
                }}
              >
                <div style={{ flex: "1 1 auto" }}>
                  <div style={{ fontWeight: 800 }}>Marketing cookies</div>
                  <div style={{ fontSize: 13, color: "rgba(0,0,0,0.70)", marginTop: 4 }}>
                    Used to personalize marketing and measure ad performance (only if you allow it).
                  </div>
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                  />
                  <span style={{ fontWeight: 700 }}>{marketing ? "On" : "Off"}</span>
                </label>
              </div>
            </div>

            <div style={{ fontSize: 12, color: "rgba(0,0,0,0.60)", marginTop: 10 }}>
              Tip: Add a “Cookie Settings” link in your footer later so users can update their
              choices without clearing browser data.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
