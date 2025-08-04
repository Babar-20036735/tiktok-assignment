import Link from "next/link";
import VerifyEmailForm from "@/components/auth/VerifyEmailForm";

const VerifyEmailPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;
  const emailParam = params["email"];
  const email = Array.isArray(emailParam) ? emailParam[0] : emailParam;

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
          <Link
            href={"/auth/signup"}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go to Sign Up
          </Link>
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
          We&apos;ve sent a verification code to <strong>{email}</strong>
        </p>
      </div>
      <VerifyEmailForm email={email} />
    </div>
  );
};

export default VerifyEmailPage;
