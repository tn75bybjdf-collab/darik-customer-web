export default function SupportPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f6f7f9",
        padding: "48px 20px",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
        color: "#111827",
      }}
    >
      <section
        style={{
          maxWidth: 760,
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: 18,
          padding: "36px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          border: "1px solid #e5e7eb",
        }}
      >
        <h1
          style={{
            fontSize: 34,
            lineHeight: 1.2,
            margin: "0 0 12px",
            fontWeight: 800,
          }}
        >
          PartBid Support
        </h1>

        <p
          style={{
            fontSize: 18,
            lineHeight: 1.7,
            margin: "0 0 28px",
            color: "#374151",
          }}
        >
          Need help with PartBid? For support with account access, quote
          requests, supplier accounts, messages, reports, app errors, or general
          questions, contact us using the information below.
        </p>

        <div
          style={{
            display: "grid",
            gap: 16,
            marginBottom: 30,
          }}
        >
          <div
            style={{
              padding: 18,
              borderRadius: 14,
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
            }}
          >
            <strong>Email</strong>
            <p style={{ margin: "6px 0 0" }}>
              <a
                href="mailto:morforless444@gmail.com"
                style={{ color: "#0b63f6", textDecoration: "none" }}
              >
                morforless444@gmail.com
              </a>
            </p>
          </div>

          <div
            style={{
              padding: 18,
              borderRadius: 14,
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
            }}
          >
            <strong>Phone / WhatsApp</strong>
            <p style={{ margin: "6px 0 0" }}>
              <a
                href="tel:+962793009420"
                style={{ color: "#0b63f6", textDecoration: "none" }}
              >
                +962 79 300 9420
              </a>
            </p>
          </div>
        </div>

        <p
          style={{
            fontSize: 16,
            lineHeight: 1.7,
            color: "#374151",
            marginBottom: 22,
          }}
        >
          Please include your name, phone number, account type, and a short
          description of the issue so we can help you faster.
        </p>

        <div
          style={{
            padding: 18,
            borderRadius: 14,
            background: "#eef4ff",
            border: "1px solid #cfe0ff",
            color: "#1f2937",
          }}
        >
          <strong>Important Notice</strong>
          <p style={{ margin: "8px 0 0", lineHeight: 1.7 }}>
            PartBid is a quote-request platform that helps buyers, garages, and
            auto parts suppliers connect. PartBid does not process payments
            between buyers and suppliers. Any final purchase, delivery,
            inspection, warranty, or agreement is handled directly between the
            buyer and supplier.
          </p>
        </div>
      </section>
    </main>
  );
}