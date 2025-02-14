import { signInWithProvider } from "@/actions/auth";
import { BottomGradient } from "./auth-layout";
import { Button } from "./ui/button";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandInstagram,
} from "@tabler/icons-react";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

function GithubLogin() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleGithubLogin = () => {
    startTransition(async () => {
      try {
        const { data: redirectUrl } = await signInWithProvider("github");
        if (redirectUrl) {
          router.push(redirectUrl);
        }
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <Button
      disabled={isPending}
      onClick={handleGithubLogin}
      className="group/btn relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black shadow-input hover:bg-gray-100 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)] dark:hover:bg-zinc-800">
      {/* <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" /> */}
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin text-neutral-800 dark:text-neutral-300" />
      ) : (
        <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
      )}
      <span className="text-sm text-neutral-700 dark:text-neutral-300">
        {isPending ? "Redirecting..." : "Github"}
      </span>
      <BottomGradient />
    </Button>
  );
}

function GoogleLogin() {
  return (
    <Button className="group/btn relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black shadow-input hover:bg-gray-100 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)] dark:hover:bg-zinc-800">
      <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
      <span className="text-sm text-neutral-700 dark:text-neutral-300">
        Google
      </span>
      <BottomGradient />
    </Button>
  );
}

function InstagramLogin() {
  return (
    <Button className="group/btn relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black shadow-input hover:bg-gray-100 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)] dark:hover:bg-zinc-800">
      <IconBrandInstagram className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
      <span className="text-sm text-neutral-700 dark:text-neutral-300">
        Instagram
      </span>
      <BottomGradient />
    </Button>
  );
}

function SocialLogin() {
  return (
    <div className="flex flex-col space-y-4">
      {/* <GithubLogin /> */}
      {/* <GoogleLogin /> */}
      {/* <InstagramLogin /> */}
    </div>
  );
}

export { GithubLogin, GoogleLogin, InstagramLogin };

export default SocialLogin;
