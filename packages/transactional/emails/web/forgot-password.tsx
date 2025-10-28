import {
  Body,
  Head,
  Html,
  Section,
  Row,
  Column,
  Img,
  Text,
  Link,
  Container,
  Button,
  Hr,
} from "@react-email/components";
import { Font, Tailwind } from "../components";

/**
 * Props for the MagicLinkEmail component.
 *
 * @property {string} name - The recipient's name.
 * @property {string} loginCode - The unique login code to display in the email.
 * @property {string} [expiresAt] - Time until the login code expires, including units (e.g., "5 minutes", "1 hour"). This value will be printed in the email, if provided.
 * @property {Object} [urls] - (Optional) Object containing optional URLs used within the email.
 * @property {string} [urls.baseUrl] - (Optional) The base URL for login links. If not provided, defaults to "http://localhost:3000".
 * @property {string} [urls.terms] - (Optional) URL for the terms of service.
 * @property {string} [urls.privacy] - (Optional) URL for the privacy policy.
 * @property {string} [urls.contact] - (Optional) URL for the contact page.
 */
export interface ForgotPasswordProps {
  name: string;
  resetLink: string;
  /**
   * Time until the login code expires, including the unit (e.g., "5 minutes", "1 hour").
   * This will be shown to the user in the email, if provided.
   */
  expiresAt?: string;
  /**
   * Optional set of URLs for use in the email, including login base URL and helpful links.
   */
  urls?: {
    /**
     * Base URL for login links.
     * @default "http://localhost:3000"
     */
    baseUrl?: string;
    /**
     * Logo URL to display in the email footer.
     * @default "https://files.graphxsourcehndev.com/assets/calendar/emails/logo-long.png"
     */
    logo?: string;
    /**
     * Logo URL to display in the email footer.
     * @default "https://files.graphxsourcehndev.com/assets/calendar/emails/logo-long-muted.png"
     */
    footerLogo?: string;
    /**
     * URL to the terms of service.
     */
    terms?: string;
    /**
     * URL to the privacy policy.
     */
    privacy?: string;
    /**
     * URL to the contact/support page.
     */
    contact?: string;
  };
}

export const ForgotPasswordEmail = ({
  resetLink,
  expiresAt,
  name,
  urls = {
    baseUrl: "http://localhost:3000",
    footerLogo:
      "https://files.graphxsourcehndev.com/assets/calendar/emails/logo-long-muted.png",
    logo: "https://files.graphxsourcehndev.com/assets/calendar/emails/logo-long.png",
  },
}: ForgotPasswordProps) => (
  <Html>
    <Tailwind>
      <Head>
        <Font />
        <title>Reset your password</title>
      </Head>
      <Body className="bg-background text-foreground px-10">
        <Container className="mx-auto max-w-[550px] my-10">
          <Section id="header">
            <Link href={urls.baseUrl}>
              <Img
                src={urls.logo}
                alt="GraphXSource Logo"
                width={100 * 1.45}
                height={25 * 1.45}
              />
            </Link>
          </Section>
          <Section id="content">
            <Text className="text-muted">Hi {name},</Text>
            <Text className="text-muted">
              A request to reset your password has been made. Click the button
              below to set your new password. This recovery link will expire in{" "}
              <b>{expiresAt}</b>.
            </Text>
            <Text className="text-muted">
              If you didn&apos;t request this change, please contact our support
              team at{" "}
              <Link
                href="mailto:support@graphxserver.io"
                className="underline hover:no-underline text-muted"
              >
                development@graphxsource.hn
              </Link>
              .
            </Text>
            <Button
              href={resetLink}
              className="bg-primary text-primary-foreground px-4 py-2 text-sm rounded-md"
            >
              Reset Password
            </Button>
            <Text className="text-muted">
              Best regards,
              <br />
              The GraphXSource Team
            </Text>
          </Section>
          <Hr />
          <Section id="footer" className="text-muted-foreground">
            <Row className="text-xs">
              {urls.terms && (
                <Link
                  href={urls.terms}
                  className="underline hover:no-underline text-muted-foreground text-xs mr-4"
                >
                  Terms & Conditions
                </Link>
              )}
              {urls.privacy && (
                <Link
                  href={urls.privacy}
                  className="underline hover:no-underline text-muted-foreground text-xs mr-4"
                >
                  Privacy Policy
                </Link>
              )}
              {urls.contact && (
                <Link
                  href={urls.contact}
                  className="underline hover:no-underline text-muted-foreground text-xs mr-4"
                >
                  Contact
                </Link>
              )}
            </Row>
            <Row>
              <Column>
                <Text className="text-muted-foreground text-xs">
                  © 2025 GraphXSource. All rights reserved. 10495 Olympic Dr,
                  Dallas, TX 75220, US
                </Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Link href={urls.baseUrl}>
                  <Img
                    src={urls.footerLogo}
                    alt="GraphXSource Logo"
                    width={100}
                    height={25}
                  />
                </Link>
              </Column>
            </Row>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

ForgotPasswordEmail.PreviewProps = {
  name: "John Doe",
  resetLink: "https://www.graphxsource.com/reset-password",
  expiresAt: "5 minutes",
  urls: {
    baseUrl: "http://localhost:3000",
    footerLogo:
      "https://files.graphxsourcehndev.com/assets/calendar/emails/logo-long-muted.png",
    logo: "https://files.graphxsourcehndev.com/assets/calendar/emails/logo-long.png",
    terms: "https://www.graphxsource.com/terms",
    privacy: "https://www.graphxsource.com/privacy",
    contact: "https://www.graphxsource.com/contact",
  },
} as ForgotPasswordProps;

export default ForgotPasswordEmail;
