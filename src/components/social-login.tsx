import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { BottomGradient } from "./auth-layout";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandInstagram,
} from "@tabler/icons-react";

type Provider = "github" | "google" | "facebook";

const PROVIDERS: Record<Provider, { label: string; icon: React.ElementType }> =
  {
    github: { label: "Github", icon: IconBrandGithub },
    google: { label: "Google", icon: IconBrandGoogle },
    facebook: { label: "Instagram", icon: IconBrandInstagram }, // your Instagram uses Facebook provider
  };

async function signInWithProvider(
  provider: Provider,
  callbackURL = "/dashboard",
) {
  try {
    return await authClient.signIn.social({ provider, callbackURL });
  } catch (err) {
    console.error(`${provider} login error:`, err);
  }
}

function ProviderLogin({
  provider,
  callbackURL = "/dashboard",
}: {
  provider: Provider;
  callbackURL?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const { label, icon: Icon } = PROVIDERS[provider];

  const handleLogin = () => {
    startTransition(async () => {
      try {
        const response = await signInWithProvider(provider, callbackURL);
        if (response?.data?.redirect && response?.data?.url) {
          router.push(response.data.url);
        }
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <Button
      disabled={isPending}
      onClick={handleLogin}
      className="group/btn relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black shadow-input hover:bg-gray-100 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)] dark:hover:bg-zinc-800">
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin text-neutral-800 dark:text-neutral-300" />
      ) : (
        <Icon className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
      )}
      <span className="text-sm text-neutral-700 dark:text-neutral-300">
        {isPending ? "Redirecting..." : label}
      </span>
      <BottomGradient />
    </Button>
  );
}

function SocialLogin({ callbackURL = "/dashboard" }) {
  return (
    <div className="flex flex-col space-y-4">
      <ProviderLogin provider="github" callbackURL={callbackURL} />
      <ProviderLogin provider="google" callbackURL={callbackURL} />
      {/* <ProviderLogin provider="facebook" callbackURL={callbackURL} /> */}
    </div>
  );
}

export { ProviderLogin };
export default SocialLogin;
