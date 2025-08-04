"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  verifyEmail,
  sendVerificationEmail,
} from "@/lib/actions/email-verification";
import { toast } from "sonner";

const VerifyEmailPage = () => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email");

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email parameter is missing");
      return;
    }

    if (!code || code.length !== 6) {
      toast.error("Please enter a valid 6-digit verification code");
      return;
    }

    setIsLoading(true);

    try {
      const result = await verifyEmail(email, code);

      if (result.success) {
        toast.success("Email verified successfully!");
        router.push("/auth/signin?verified=true");
      } else {
        toast.error((result as any).error || "Verification failed");
      }
    } catch (error) {
      toast.error("An error occurred during verification");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      toast.error("Email parameter is missing");
      return;
    }

    setIsResending(true);

    try {
      const result = await sendVerificationEmail(email);

      if (result.success) {
        toast.success("Verification code resent successfully!");
        // For testing purposes, show the code in console
        if ((result as any).verificationCode) {
          console.log(
            `New verification code: ${(result as any).verificationCode}`
          );
        }
      } else {
        toast.error(
          (result as any).error || "Failed to resend verification code"
        );
      }
    } catch (error) {
      toast.error("An error occurred while resending the code");
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="text-center text-3xl font-extrabold text-gray-900">
            Error
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Email parameter is missing. Please try signing up again.
          </p>
        </div>
        <div className="max-w-md w-full mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
          <Button
            onClick={() => router.push("/auth/signup")}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go to Sign Up
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900">
          Verify Your Email
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          We've sent a verification code to <strong>{email}</strong>
        </p>
      </div>
      <div className="max-w-md w-full mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700"
            >
              Verification Code
            </label>
            <div className="flex justify-center">
              <InputOTP
                value={code}
                onChange={(value) => setCode(value)}
                maxLength={6}
                disabled={isLoading}
                className="gap-2"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            disabled={isLoading || code.length !== 6}
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
          <Button
            variant="outline"
            onClick={handleResendCode}
            disabled={isResending}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isResending ? "Sending..." : "Resend Code"}
          </Button>
        </div>

        <div className="mt-4 text-center">
          <Button
            variant="ghost"
            onClick={() => router.push("/auth/signin")}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            Back to Sign In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
