import { ImageResponse } from "next/og";
import { SITE_CONFIG } from "@/lib/constants";

export const alt = SITE_CONFIG.title;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#FFFFFF",
          color: "#111111",
          padding: "56px 64px",
          border: "16px solid #111111",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "2px solid #E5E5E5",
            paddingBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "48px",
                height: "48px",
                backgroundColor: "#111111",
                color: "#FFFFFF",
                fontSize: "20px",
                fontWeight: 700,
                letterSpacing: "2px",
              }}
            >
              {SITE_CONFIG.monogram}
            </div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: 600,
                letterSpacing: "-0.02em",
              }}
            >
              {SITE_CONFIG.name}
            </div>
          </div>

          <div
            style={{
              fontSize: "18px",
              color: "#666666",
              letterSpacing: "2px",
            }}
          >
            RIDWANFAIZ.WEB.ID
          </div>
        </div>

        {/* Center Display */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div
            style={{
              fontSize: "104px",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
            }}
          >
            PORTFOLIO
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#666666",
              letterSpacing: "-0.01em",
            }}
          >
            Frontend Developer · Software Developer · UI/UX Designer · Graphic
            Designer
          </div>
        </div>

        {/* Bottom Metadata */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "2px solid #E5E5E5",
            paddingTop: "24px",
            fontSize: "18px",
            color: "#666666",
            letterSpacing: "1.5px",
          }}
        >
          <div>TELKOM UNIVERSITY — S1 INFORMATIKA</div>
          <div>MODERN MINIMALIST · INDUSTRIAL EDITORIAL</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
