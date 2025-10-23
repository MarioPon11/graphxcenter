import { EmailFormCard } from "@/components/auth/sign-up/email-form";
import { DetailsFormCard } from "@/components/auth/sign-up/details-form";
import { Verification } from "@/components/auth/sign-up/verification";

type Search = { [key: string]: string | string[] | undefined };

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const search = await searchParams;
  const step = search.step ?? "email";
  const emailParam = Array.isArray(search.email)
    ? search.email[0]
    : search.email;

  if (step === "email") {
    return <EmailFormCard />;
  }

  if (step === "details") {
    return (
      <DetailsFormCard
        initialEmail={typeof emailParam === "string" ? emailParam : undefined}
      />
    );
  }

  if (step === "verification") {
    return <Verification />;
  }
}
