"use client";

export default function ComingSoonPage() {
  return (
    <main className="page">
      <section className="hero">
        <div className="badge">Coming Soon</div>

        <h1>getdarik.com</h1>

        <p className="headline">
          A new shopping experience for Jordan is on the way.
        </p>

        <p className="description">
          Darik is preparing a faster, cleaner, and more reliable way to shop
          for everyday essentials, with simple ordering, trusted fulfillment,
          and delivery built around local customers.
        </p>

        <div className="statusCard">
          <div>
            <span>Launch status</span>
            <strong>In development</strong>
          </div>

          <div>
            <span>Market</span>
            <strong>Jordan</strong>
          </div>

          <div>
            <span>Website</span>
            <strong>getdarik.com</strong>
          </div>
        </div>

        <p className="footerText">
          Darik Technologies © {new Date().getFullYear()}
        </p>
      </section>

      <style jsx>{`
        .page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 28px;
          background:
            radial-gradient(circle at top left, rgba(37, 99, 235, 0.18), transparent 32%),
            radial-gradient(circle at bottom right, rgba(15, 23, 42, 0.18), transparent 34%),
            linear-gradient(135deg, #f8fafc 0%, #eef2ff 45%, #f9fafb 100%);
          color: #111827;
          font-family:
            Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }

        .hero {
          width: min(920px, 100%);
          text-align: center;
          background: rgba(255, 255, 255, 0.82);
          border: 1px solid rgba(226, 232, 240, 0.95);
          border-radius: 34px;
          padding: 56px 38px 34px;
          box-shadow:
            0 30px 90px rgba(15, 23, 42, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(18px);
        }

        .badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 22px;
          padding: 9px 16px;
          border-radius: 999px;
          background: #111827;
          color: #ffffff;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        h1 {
          margin: 0;
          font-size: clamp(46px, 8vw, 92px);
          line-height: 0.95;
          letter-spacing: -0.075em;
          color: #0f172a;
        }

        .headline {
          max-width: 720px;
          margin: 26px auto 0;
          font-size: clamp(24px, 4vw, 42px);
          line-height: 1.08;
          font-weight: 850;
          letter-spacing: -0.045em;
          color: #111827;
        }

        .description {
          max-width: 700px;
          margin: 20px auto 0;
          font-size: 18px;
          line-height: 1.75;
          color: #4b5563;
        }

        .statusCard {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin: 36px auto 0;
          max-width: 760px;
        }

        .statusCard div {
          padding: 18px 14px;
          border-radius: 22px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.06);
        }

        .statusCard span {
          display: block;
          margin-bottom: 7px;
          color: #6b7280;
          font-size: 13px;
          font-weight: 700;
        }

        .statusCard strong {
          display: block;
          color: #111827;
          font-size: 17px;
          font-weight: 900;
        }

        .footerText {
          margin: 34px 0 0;
          color: #6b7280;
          font-size: 14px;
        }

        @media (max-width: 720px) {
          .page {
            padding: 16px;
          }

          .hero {
            padding: 42px 22px 28px;
            border-radius: 26px;
          }

          .description {
            font-size: 16px;
          }

          .statusCard {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}