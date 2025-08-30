"use client";

import { toast } from "sonner";
import { Button } from "./ui/button";
import { authClient } from "@/lib/auth-client";

export function LogoutButton() {
  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast("You have been signed out.");
            window.location.href = "/signin";
          },
        },
      });
    }
  };

  return (
    <Button variant="outline" onClick={handleLogout}>
      Sign Out
    </Button>
  );
}
