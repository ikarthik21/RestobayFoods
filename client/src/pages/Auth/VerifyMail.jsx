import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import restoApiInstance from "../../service/api/api";

const VerifyMail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Verifying...");
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const token = searchParams.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("Invalid or missing token.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await restoApiInstance.verifyEmail({ token });
        if (response) {
          if (response.type === "success") {
            setIsSuccess(true);
          }
          setStatus(response.message);
        }
        setIsLoading(false);
      } catch (err) {
        const errorMessage =
          (err.response && err.response.data && err.response.data.message) ||
          err.message ||
          "Something went wrong.";
        setStatus(errorMessage);
        setIsSuccess(false);
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  const handleRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-[#ef5644] p-6 text-center">
          <h1 className="text-2xl font-bold text-white">Email Verification</h1>
        </div>

        <div className="p-8">
          <div className="flex flex-col items-center justify-center text-center">
            {isLoading ? (
              <div className="flex flex-col items-center">
                <svg
                  className="animate-spin h-12 w-12 text-[#ef5644] mb-4"
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
                <p className="text-lg text-gray-600">{status}</p>
              </div>
            ) : (
              <>
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
                <p className="text-lg font-medium text-gray-800 mb-8">
                  {status}
                </p>
                <button
                  onClick={handleRedirect}
                  className="w-full bg-[#ef5644] hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition duration-200 ease-in-out"
                >
                  Back to Login
                </button>
              </>
            )}
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            If you have any questions or need assistance, please contact our
            support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyMail;
