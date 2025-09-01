"use client";

import { InputField } from "@/components/reusable-form-fields";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Link from "next/link";
import SocialLogin from "@/components/social-login";
import { AuthButton } from "@/components/auth-layout";
import { AuthLayout, AuthSeparator } from "@/components/auth-layout";
import { signUp } from "@/lib/auth-client";

const schema = z.object({
  name: z
    .string()
    .min(2, "Name is too short")
    .regex(/^[a-zA-Z\s]+$/, "Name must only contain letters and spaces"), // Only letters and spaces
  email: z
    .string()
    .email("Invalid email format")
    .min(6, "Email is too short")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email domain format",
    ), // More domain specificity
  password: z
    .string()
    .min(8, "Password is too short")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter") // Uppercase letter
    .regex(/[a-z]/, "Password must contain at least one lowercase letter") // Lowercase letter
    .regex(/[0-9]/, "Password must contain at least one digit") // Number
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ), // Special character
});

type SignUpType = z.infer<typeof schema>;

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  USER_EXISTS:
    "An account with this email already exists. Please sign in instead.",
  USER_ALREADY_EXISTS:
    "An account with this email already exists. Please sign in instead.",
  WEAK_PASSWORD: "Password is too weak. Please choose a stronger password.",
  INVALID_EMAIL: "Please enter a valid email address.",
};

function getAuthErrorMessage(error: { code?: string; message?: string }) {
  return (
    AUTH_ERROR_MESSAGES[error.code || ""] ||
    error.message ||
    "An unexpected error occurred. Please try again."
  );
}

export default function SignupPage() {
  const form = useForm<SignUpType>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (payload: SignUpType) => {
    await signUp.email({
      ...payload,
      callbackURL: "/dashboard",
      fetchOptions: {
        onSuccess: () => {
          toast.success("Welcome to AurthaFi!");
        },
        onError: ({ error }) => {
          // const message = "An unexpected error occurred. Please try again.";
          const message = getAuthErrorMessage(error);
          form.setError("root", { type: "manual", message });
          toast.error(message);
        },
      },
    });
  };

  return (
    <AuthLayout
      title="Welcome to AurthaFi"
      description="Sign up to AurthaFi to start tracking your expenses">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="my-4 space-y-4">
          <InputField
            control={form.control}
            name="name"
            label="Full Name"
            placeholder="Tyler Durden"
          />
          <InputField
            control={form.control}
            name="email"
            label="Email"
            type="email"
            placeholder="project.mayhem@fc.com"
          />
          <InputField
            control={form.control}
            name="password"
            label="Password"
            type="password"
            placeholder="••••••••"
          />
          {form.formState.errors.root && (
            <div className="text-sm text-destructive">
              {form.formState.errors.root.message}
            </div>
          )}

          <AuthButton type="Sign up" formState={form.formState} />
        </form>
      </Form>

      {/* back to sign in */}
      <Link href="/signin">
        <Button variant="link" className="p-0">
          Already have an account?
        </Button>
      </Link>

      <AuthSeparator />

      <SocialLogin />
    </AuthLayout>
  );
}
