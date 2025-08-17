"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function ResetPassword() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const router = useRouter();
  const [newPass, setNewPass] = useState("");
  const handleReset = async () => {
    const { error } = await authClient.resetPassword({
      token,
      newPassword: newPass,
    });
    if (!error) router.push("/signin");
  };
  return (
    <div className="mx-auto mt-20 max-w-md rounded bg-white p-6 shadow">
      <h1 className="mb-4 text-2xl">Reset Password</h1>
      <input
        type="password"
        placeholder="New Password"
        value={newPass}
        onChange={(e) => setNewPass(e.target.value)}
        className="mb-4 w-full rounded border p-2"
      />
      <button
        onClick={handleReset}
        className="w-full rounded bg-blue-500 p-2 text-white">
        Update Password
      </button>
    </div>
  );
}
