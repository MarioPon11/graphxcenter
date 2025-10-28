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
  Heading,
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
export interface WelcomeEmailProps {
  introUrl: string;
  signInUrl: string;
  appName: string;
  heroImage: string;
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

export const WelcomeEmail = ({
  heroImage,
  introUrl,
  signInUrl,
  appName,
  urls = {
    baseUrl: "http://localhost:3000",
    footerLogo:
      "https://files.graphxsourcehndev.com/assets/calendar/emails/logo-long-muted.png",
    logo: "https://files.graphxsourcehndev.com/assets/calendar/emails/logo-long.png",
  },
}: WelcomeEmailProps) => (
  <Html>
    <Tailwind>
      <Head>
        <Font />
        <title>Reset your password</title>
      </Head>
      <Body className="bg-background text-foreground px-10">
        <Container className="mx-auto max-w-[550px] my-10">
          <Section id="header" className="mb-10">
            <Link href={urls.baseUrl}>
              <Img
                className="mx-auto"
                src={urls.logo}
                alt="GraphXSource Logo"
                width={100 * 1.45}
                height={25 * 1.45}
              />
            </Link>
          </Section>
          <Section id="content">
            <Img
              src={heroImage}
              alt="GraphxCloud Hero Image"
              className="w-full h-[200px] object-cover rounded-md"
            />
            <Heading as="h1" className="text-center">
              Welcome to {appName}
            </Heading>
            <Text className="text-muted text-center">
              Thank you for signing up for {appName}. Empower your team with our
              integrated CMS & HR system and discover how seamless document
              management and HR processes can boost your productivity. Take
              control, stay organized, and let your team focus on what matters
              most.
            </Text>
            <Text className="text-muted text-center">
              <b>Growing your business</b>
            </Text>
            <Row>
              <Column className="w-1/6" />
              <Column align="center">
                <Button
                  href={introUrl}
                  className="bg-transparent border border-muted border-solid text-muted px-4 py-2 text-sm rounded-md min-w-[75px]"
                >
                  Watch Intro
                </Button>
              </Column>
              <Column align="center">
                <Button
                  href={signInUrl}
                  className="bg-primary text-primary-foreground border border-primary border-solid px-4 py-2 text-sm rounded-md min-w-[75px]"
                >
                  Sign In
                </Button>
              </Column>
              <Column className="w-1/6" />
            </Row>
          </Section>
          <Hr />
          <Section
            id="footer"
            className="text-muted-foreground"
            cellPadding={0}
          >
            <Row className="w-full text-center">
              <Column className="w-1/4 text-center" />
              {urls.terms && (
                <Column align="center">
                  <Link
                    href={urls.terms}
                    className="underline hover:no-underline text-muted-foreground text-xs inline-block"
                  >
                    <span className="pr-4">Terms &amp; Conditions</span>
                  </Link>
                </Column>
              )}
              {urls.privacy && (
                <Column align="center">
                  <Link
                    href={urls.privacy}
                    className="underline hover:no-underline text-muted-foreground text-xs inline-block"
                  >
                    <span className="pr-4">Privacy Policy</span>
                  </Link>
                </Column>
              )}
              {urls.contact && (
                <Column align="center">
                  <Link
                    href={urls.contact}
                    className="underline hover:no-underline text-muted-foreground text-xs inline-block"
                  >
                    <span className="pr-0">Contact Us</span>
                  </Link>
                </Column>
              )}
              <Column className="w-1/4" />
            </Row>
            <Row>
              <Text className="text-muted-foreground text-xs text-center">
                © 2025 GraphXSource. All rights reserved. 10495 Olympic Dr,
                Dallas, TX 75220, US
              </Text>
            </Row>
            <Row>
              <Link href={urls.baseUrl}>
                <Img
                  src={urls.footerLogo}
                  alt="GraphXSource Logo"
                  className="mx-auto"
                  width={100}
                  height={25}
                />
              </Link>
            </Row>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

WelcomeEmail.PreviewProps = {
  introUrl: "https://www.graphxsource.com/intro",
  signInUrl: "https://www.graphxsource.com/sign-in",
  appName: "GraphxCloud",
  heroImage:
    "https://files.graphxsourcehndev.com/assets/calendar/emails/hero-img.png",
  urls: {
    baseUrl: "http://localhost:3000",
    footerLogo:
      "https://files.graphxsourcehndev.com/assets/calendar/emails/logo-long-muted.png",
    logo: "https://files.graphxsourcehndev.com/assets/calendar/emails/logo-long.png",
    terms: "https://www.graphxsource.com/terms",
    privacy: "https://www.graphxsource.com/privacy",
    contact: "https://www.graphxsource.com/contact",
  },
} as WelcomeEmailProps;

export default WelcomeEmail;
