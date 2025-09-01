"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const handleRequest = async () => {
    if (!email) {
      setMessage("Please enter your email address");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      });

      if (error) {
        console.error("Password reset error:", error);
        setMessage(`Error: ${error.message || "Failed to send reset email"}`);
        setMessageType("error");
      } else {
        setMessage(
          "Password reset email sent! Check your inbox and spam folder.",
        );
        setMessageType("success");
        setEmail(""); // Clear email field on success
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setMessage("An unexpected error occurred. Please try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-20 max-w-md rounded bg-white p-6 shadow">
      <h1 className="mb-4 text-2xl">Forgot Password</h1>

      {message && (
        <div
          className={`mb-4 rounded p-3 ${
            messageType === "success"
              ? "border border-green-400 bg-green-100 text-green-700"
              : "border border-red-400 bg-red-100 text-red-700"
          }`}>
          {message}
        </div>
      )}

      <input
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4 w-full rounded border p-2"
        disabled={isLoading}
        required
      />

      <button
        onClick={handleRequest}
        disabled={isLoading || !email}
        className={`w-full rounded p-2 text-white ${
          isLoading || !email
            ? "cursor-not-allowed bg-gray-400"
            : "bg-blue-500 hover:bg-blue-600"
        }`}>
        {isLoading ? "Sending..." : "Send Reset Link"}
      </button>

      <div className="mt-4 text-sm text-gray-600">
        <p>• Check your spam/junk folder if you dont see the email</p>
        <p>• The reset link will expire in 1 hour</p>
        <p>• Make sure the email address is correct</p>
      </div>
    </div>
  );
}
