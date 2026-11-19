import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export interface ContactNotificationProps {
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
}

export function ContactNotification({
  name,
  email,
  subject,
  message,
  submittedAt,
}: ContactNotificationProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{`[PORTFOLIO] New Message from ${name}: ${subject}`}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={headerBar}>
            <Text style={monogram}>RF</Text>
            <Text style={headerMeta}>PORTFOLIO // CONTACT NOTIFICATION</Text>
          </Section>

          {/* Title */}
          <Section style={contentSection}>
            <Heading as="h1" style={heading}>
              New Inquiry Received
            </Heading>
            <Text style={subheading}>
              A visitor submitted a message through ridwanfaiz.web.id. Reply
              directly to respond to {name}.
            </Text>

            {/* Metadata Table */}
            <Section style={metaBox}>
              <Text style={metaLabel}>SENDER NAME</Text>
              <Text style={metaValue}>{name}</Text>

              <Hr style={metaDivider} />

              <Text style={metaLabel}>REPLY-TO EMAIL</Text>
              <Text style={metaValue}>{email}</Text>

              <Hr style={metaDivider} />

              <Text style={metaLabel}>SUBJECT</Text>
              <Text style={metaValue}>{subject}</Text>

              <Hr style={metaDivider} />

              <Text style={metaLabel}>SUBMISSION TIMESTAMP</Text>
              <Text style={metaValueMono}>{submittedAt}</Text>
            </Section>

            {/* Message Body */}
            <Text style={sectionTitle}>MESSAGE</Text>
            <Section style={messageBox}>
              <Text style={messageText}>{message}</Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footerSection}>
            <Hr style={footerDivider} />
            <Text style={footerText}>
              Ridwan Faiz Herlambang · Portfolio Contact System ·
              no-reply@mail.ridwanfaiz.web.id
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f5f5f5",
  color: "#111111",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  margin: "0",
  padding: "24px 12px",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e5e5",
  margin: "0 auto",
  maxWidth: "600px",
  width: "100%",
};

const headerBar = {
  backgroundColor: "#111111",
  padding: "18px 28px",
};

const monogram = {
  color: "#ffffff",
  fontFamily: "monospace",
  fontSize: "14px",
  fontWeight: "700",
  letterSpacing: "2px",
  margin: "0 0 4px 0",
};

const headerMeta = {
  color: "#a3a3a3",
  fontFamily: "monospace",
  fontSize: "11px",
  letterSpacing: "1.5px",
  margin: "0",
};

const contentSection = {
  padding: "28px",
};

const heading = {
  color: "#111111",
  fontSize: "22px",
  fontWeight: "700",
  letterSpacing: "-0.02em",
  lineHeight: "1.25",
  margin: "0 0 8px 0",
};

const subheading = {
  color: "#666666",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "0 0 24px 0",
};

const metaBox = {
  backgroundColor: "#f5f5f5",
  border: "1px solid #e5e5e5",
  marginBottom: "24px",
  padding: "16px 20px",
};

const metaLabel = {
  color: "#666666",
  fontFamily: "monospace",
  fontSize: "10px",
  fontWeight: "600",
  letterSpacing: "1.5px",
  margin: "0 0 4px 0",
};

const metaValue = {
  color: "#111111",
  fontSize: "14px",
  fontWeight: "600",
  lineHeight: "1.4",
  margin: "0",
  wordBreak: "break-word" as const,
};

const metaValueMono = {
  color: "#111111",
  fontFamily: "monospace",
  fontSize: "12px",
  lineHeight: "1.4",
  margin: "0",
};

const metaDivider = {
  borderColor: "#e5e5e5",
  margin: "12px 0",
};

const sectionTitle = {
  color: "#111111",
  fontFamily: "monospace",
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "1.5px",
  margin: "0 0 8px 0",
};

const messageBox = {
  border: "1px solid #111111",
  padding: "18px 20px",
};

const messageText = {
  color: "#111111",
  fontSize: "14px",
  lineHeight: "1.65",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
  wordBreak: "break-word" as const,
};

const footerSection = {
  padding: "0 28px 24px 28px",
};

const footerDivider = {
  borderColor: "#e5e5e5",
  margin: "0 0 16px 0",
};

const footerText = {
  color: "#666666",
  fontFamily: "monospace",
  fontSize: "11px",
  lineHeight: "1.5",
  margin: "0",
};

export default ContactNotification;
