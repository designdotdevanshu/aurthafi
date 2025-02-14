"use client";

import { signin } from "@/actions/auth";
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

export type LoginType = z.infer<typeof schema>;

export default function LoginPage() {
  const form = useForm<LoginType>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginType) => {
    try {
      const response = await signin(data); // Now returns an object instead of throwing
      if (response && !response.data) {
        console.error("Login failed:", response.message);
        form.setError("root", {
          type: "manual",
          message: response.message, // Use the returned error message
        });
        toast.error(response.message); // Show error toast
        return;
      }

      toast.success("Welcome back!"); // Show success toast
      // Success case: No need for further action, as redirect() happens in signin
    } catch (error: any) {
      console.error("Unexpected error in onSubmit:", error);
      toast.error("An unexpected error occurred.");
    }
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
            placeholder="projectmayhem@fc.com"
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
        {/* <Link href="/forgot-password">
          <Button variant="link" className="p-0">
            Forgot password?
          </Button>
        </Link> */}
        <Link href="/auth/signup">
          <Button variant="link" className="p-0">
            Don&apos;t have an account?
          </Button>
        </Link>
      </div>

      <AuthSeparator />

      <SocialLogin />
    </AuthLayout>
  );
}
