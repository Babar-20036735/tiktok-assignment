"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { X, LogIn, UserPlus } from "lucide-react";

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginDialog({ isOpen, onClose }: LoginDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Login Required
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          You need to be logged in to like, dislike, or comment on videos.
        </p>

        <div className="space-y-3">
          <Link href="/auth/signin" className="block">
            <Button className="w-full flex items-center justify-center space-x-2">
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </Button>
          </Link>

          <Link href="/auth/signup" className="block">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center space-x-2"
            >
              <UserPlus className="h-4 w-4" />
              <span>Create Account</span>
            </Button>
          </Link>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Continue without logging in
          </button>
        </div>
      </div>
    </div>
  );
}
