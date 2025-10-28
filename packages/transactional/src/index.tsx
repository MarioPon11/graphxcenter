import React from "react";
import { render } from "@react-email/components";
import {
  MagicLinkEmail,
  type MagicLinkEmailProps,
} from "../emails/web/magic-link";
import {
  ForgotPasswordEmail,
  type ForgotPasswordProps,
} from "../emails/web/forgot-password";
import {
  PasswordResetEmail,
  type PasswordResetEmailProps,
} from "../emails/web/password-reset";
import { WelcomeEmail, type WelcomeEmailProps } from "../emails/web/welcome";

export function renderMagicLinkEmail(
  props: MagicLinkEmailProps
): Promise<string> {
  return render(<MagicLinkEmail {...props} />);
}

export function renderForgotPasswordEmail(
  props: ForgotPasswordProps
): Promise<string> {
  return render(<ForgotPasswordEmail {...props} />);
}

export function renderPasswordResetEmail(
  props: PasswordResetEmailProps
): Promise<string> {
  return render(<PasswordResetEmail {...props} />);
}

export function renderWelcomeEmail(props: WelcomeEmailProps): Promise<string> {
  return render(<WelcomeEmail {...props} />);
}
