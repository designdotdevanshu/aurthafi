"use client";

import { InputField } from "@/components/reusable-form-fields";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import SocialLogin from "@/components/social-login";
import { AuthButton } from "@/components/auth-layout";
import { AuthLayout, AuthSeparator } from "@/components/auth-layout";
import { signIn } from "@/lib/auth-client";

const schema = z.object({
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

type LoginType = z.infer<typeof schema>;

const LOGIN_ERROR_MESSAGES: Record<string, string> = {
  INVALID_PASSWORD:
    "Invalid password. Please check your password and try again.",
  USER_NOT_FOUND: "No account found with this email address.",
  INVALID_EMAIL: "Please enter a valid email address.",
  TOO_MANY_REQUESTS: "Too many login attempts. Please try again later.",
};

function getLoginErrorMessage(error: { code?: string; message?: string }) {
  return (
    LOGIN_ERROR_MESSAGES[error.code || ""] ||
    error.message ||
    "Login failed. Please try again."
  );
}

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackURL = searchParams.get("redirectTo") || "/dashboard";

  const form = useForm<LoginType>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginType) => {
    await signIn.email(
      { ...data, callbackURL },
      {
        onSuccess: (res) => {
          console.log("Login successful:", res);
          toast.success("Welcome back to AurthaFi!");
          window.location.href = callbackURL;
        },
        onError: ({ error }) => {
          const message = getLoginErrorMessage(error);
          form.setError("root", { type: "manual", message });
          toast.error(message);
        },
      },
    );
  };

  return (
    <AuthLayout
      title="Welcome back to AurthaFi"
      description="Sign in to AurthaFi to continue tracking your expenses">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="my-4 space-y-4">
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

          <AuthButton type="Sign in" formState={form.formState} />
        </form>
      </Form>

      {/* forgot password and back to sign up */}
      <div className="flex justify-between text-sm">
        <Link href="/forgot-password">
          <Button variant="link" className="p-0">
            Forgot password?
          </Button>
        </Link>
        <Link href="/signup">
          <Button variant="link" className="p-0">
            Don&apos;t have an account?
          </Button>
        </Link>
      </div>

      <AuthSeparator />

      <SocialLogin callbackURL={callbackURL} />
    </AuthLayout>
  );
}
