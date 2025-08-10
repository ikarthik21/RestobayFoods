import { useState } from "react";
import restoApiInstance from "../../service/api/api";

// eslint-disable-next-line react/prop-types
const ForgotPassword = ({ setshowDetails }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErrorMessage("");
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    if (!email) {
      setErrorMessage("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await restoApiInstance.forgotPassword({ email });
      if (response) {
        setStatus(
          response.message || "Password reset instructions sent to your email!"
        );
        setIsSuccess(response.type === "success" || response.status === 200);
      } else {
        setStatus("Password reset instructions sent to your email!");
        setIsSuccess(true);
      }
    } catch (err) {
      const errorMessage =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        "Failed to process your request. Please try again.";
      setStatus(errorMessage);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Show success/error message after form submission
  if (status) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-[#ef5644] p-6 text-center">
            <h1 className="text-2xl font-bold text-white">Forgot Password</h1>
          </div>
          <div className="p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-6">
                {isSuccess ? (
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                    <svg
                      className="h-10 w-10 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
                    <svg
                      className="h-10 w-10 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-lg font-medium text-gray-800 mb-8">{status}</p>
              <button
                onClick={() => {
                  setshowDetails("login");
                }}
                className="w-full bg-[#ef5644] hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition duration-200 ease-in-out"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-[#ef5644] p-6 text-center">
          <h1 className="text-2xl font-bold text-white">Forgot Password</h1>
        </div>
        <div className="p-8">
          <p className="text-gray-600 mb-6 text-center">
            {
              " Enter your email address and we'll send you a link to reset your password."
            }
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errorMessage ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#ef5644] focus:border-[#ef5644] sm:text-sm`}
                  placeholder="Enter your email"
                />
                {errorMessage && (
                  <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ef5644] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ef5644] transition duration-200 ease-in-out"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Remember your password?{" "}
            <button
              onClick={() => {
                setshowDetails("login");
              }}
              className="font-medium text-[#ef5644] hover:text-red-700"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
