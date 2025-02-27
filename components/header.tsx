import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "./signout-button";
import { LayoutDashboard, PenBox } from "lucide-react";

async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const SignedIn = ({ children }: { children: React.ReactNode }) => {
    return user ? children : null;
  };

  const SignedOut = ({ children }: { children: React.ReactNode }) => {
    return !user ? children : null;
  };

  const SignInButton = ({ children }: { children: React.ReactNode }) => {
    return !user ? <Link href="/auth/signin">{children}</Link> : null;
  };

  const UserButton = () => {
    return user ? (
      <Avatar>
        <AvatarImage src={user.user_metadata.avatar_url} className="size-10" />
        <AvatarFallback>
          {user.user_metadata?.displayName?.[0] ||
            user.user_metadata?.full_name?.[0]}
        </AvatarFallback>
      </Avatar>
    ) : null;
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/">
          <h1 className="gradient-title cursor-pointer text-3xl font-bold">
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Aurtha
            </span>
            Fi
          </h1>
        </Link>

        {/* Navigation Links - Different for signed in/out users */}
        <div className="hidden items-center space-x-8 md:flex">
          <SignedOut>
            <Link
              href="/#features"
              className="text-gray-600 hover:text-blue-600">
              Features
            </Link>
            <Link
              href="/#testimonials"
              className="text-gray-600 hover:text-blue-600">
              Testimonials
            </Link>
          </SignedOut>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <SignedIn>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
              <Button variant="outline">
                <LayoutDashboard size={18} />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>
            <Link href="/transaction/create">
              <Button className="flex items-center gap-2">
                <PenBox size={18} />
                <span className="hidden md:inline">Add Transaction</span>
              </Button>
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <Button variant="outline">Sign In</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <LogoutButton />
          </SignedIn>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}

export { Header };
