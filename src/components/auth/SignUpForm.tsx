"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/users";
import Link from "next/link";
import FormInput from "@/components/ui/form-input";
import {
  signUpSchema,
  SignUpFormData,
} from "@/components/schemas/SignupSchema";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isLoading },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    setError("");

    try {
      const result = await createUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        setError(result.error);
      } else {
        // Redirect to verification page after successful signup
        router.push(
          `/auth/verify-email?email=${encodeURIComponent(data.email)}`
        );
      }
    } catch (error: unknown) {
      console.error("Sign-up error:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-md w-full mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Full Name"
          id="name"
          type="text"
          error={errors.name?.message}
          required
          {...register("name")}
        />

        <FormInput
          label="Email"
          id="email"
          type="email"
          error={errors.email?.message}
          required
          {...register("email")}
        />

        <FormInput
          label="Password"
          id="password"
          type="password"
          error={errors.password?.message}
          required
          showPasswordToggle
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          {...register("password")}
        />

        <FormInput
          label="Confirm Password"
          id="confirmPassword"
          type="password"
          error={errors.confirmPassword?.message}
          required
          showPasswordToggle
          showPassword={showConfirmPassword}
          onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
          {...register("confirmPassword")}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
