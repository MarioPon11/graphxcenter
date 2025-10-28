import { Font as EmailFont } from "@react-email/components";

export const Font = () => (
  <EmailFont
    fontFamily="Roboto"
    fallbackFontFamily="sans-serif"
    webFont={{
      url: "https://fonts.googleapis.com/css2?family=Roboto:ital,wdth,wght@0,75..100,100..900;1,75..100,100..900&display=swap",
      format: "embedded-opentype",
    }}
  />
);
