"use client";

import { toast } from "sonner";
import { Button } from "./ui/button";
import { signout } from "@/actions/auth";

export function LogoutButton() {
  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      await signout();
      toast("You have been signed out.");
    }
  };

  return (
    <Button variant="outline" onClick={handleLogout}>
      Sign Out
    </Button>
  );
}
