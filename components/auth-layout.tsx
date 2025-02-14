import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { FormState } from "react-hook-form";
import { cn } from "@/lib/utils";

const AuthLayout = React.forwardRef<
  HTMLDivElement,
  {
    title: string;
    description: string;
    children: React.ReactNode;
    className?: string;
  }
>(({ className, title, description, children }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mx-auto w-full max-w-md rounded-none bg-white p-4 shadow-input dark:bg-black md:rounded-2xl md:p-8",
      className,
    )}>
    {title && (
      <h1
        className={cn(
          "text-xl font-bold text-neutral-800 dark:text-neutral-200",
        )}>
        {title}
      </h1>
    )}
    {description && (
      <p
        className={cn(
          "mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300",
        )}>
        {description}
      </p>
    )}
    {children}
  </div>
));
AuthLayout.displayName = "AuthLayout";

const AuthTitle = React.forwardRef<
  HTMLDivElement,
  { title: string; className?: string }
>(({ title, className }, ref) => (
  <h1
    ref={ref}
    className={cn(
      "text-xl font-bold text-neutral-800 dark:text-neutral-200",
      className,
    )}>
    {title}
  </h1>
));
AuthTitle.displayName = "AuthTitle";

const AuthDescription = React.forwardRef<
  HTMLDivElement,
  { description: string; className?: string }
>(({ description, className }, ref) => (
  <p
    ref={ref}
    className={cn(
      "mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300",
      className,
    )}>
    {description}
  </p>
));
AuthDescription.displayName = "AuthDescription";

const BottomGradient = React.forwardRef<HTMLSpanElement>((_, ref) => (
  <>
    <span
      ref={ref}
      className={cn(
        "absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100",
      )}
    />
    <span
      ref={ref}
      className={cn(
        "absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100",
      )}
    />
  </>
));
BottomGradient.displayName = "BottomGradient";

const loadingText = (
  type: "Sign in" | "Sign up" | "Reset Password" | "Forgot Password",
) => {
  const OBJ = {
    "Sign in": "Signing in...",
    "Sign up": "Signing up...",
    "Reset Password": "Resetting password...",
    "Forgot Password": "Sending email...",
  };

  return OBJ[type];
};

const AuthButton = React.forwardRef<
  HTMLButtonElement,
  {
    type: "Sign in" | "Sign up" | "Reset Password" | "Forgot Password";
    formState: FormState<any>;
  }
>(({ type, formState }, ref) => (
  <Button
    ref={ref}
    type="submit"
    disabled={formState.isSubmitting}
    className={cn(
      "group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]",
    )}>
    {formState.isSubmitting ? (
      <p className={cn("flex items-center justify-center gap-x-2")}>
        <Loader2 className={cn("animate-spin")} /> {loadingText(type)}
      </p>
    ) : (
      <>{type} &rarr;</>
    )}
    <BottomGradient />
  </Button>
));
AuthButton.displayName = "AuthButton";

const AuthSeparator = React.forwardRef<HTMLDivElement, { className?: string }>(
  ({ className }, ref) => (
    <div
      ref={ref}
      className={cn(
        "my-4 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700",
        className,
      )}
    />
  ),
);
AuthSeparator.displayName = "AuthSeparator";

export {
  AuthButton,
  AuthDescription,
  AuthLayout,
  AuthSeparator,
  AuthTitle,
  BottomGradient,
};
