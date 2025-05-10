import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import restoApiInstance from "../../service/api/api";
import useFormData from "../../hooks/useFormData"; // adjust path if needed

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const {
    data: formData,
    handleChange,
    handleSubmit: submitForm,
    isLoading
  } = useFormData(
    { password: "", confirmPassword: "", token },
    async (data) => {
      const response = await restoApiInstance.resetPassword({
        token,
        newPassword: data.password
      });
      return response;
    }
  );

  const [errors, setErrors] = useState({});
  const [tokenStatus, setTokenStatus] = useState({
    isChecking: true,
    isValid: false,
    message: "Verifying reset link..."
  });
  const [resetStatus, setResetStatus] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenStatus({
          isChecking: false,
          isValid: false,
          message: "Invalid or missing token."
        });
        return;
      }

      try {
        const response = await restoApiInstance.validateResetToken({ token });

        if (response) {
          setTokenStatus({
            isChecking: false,
            isValid: true,
            message: response.message
          });
        } else {
          setTokenStatus({
            isChecking: false,
            isValid: false,
            message:
              response?.data?.message ||
              "This password reset link is invalid or has expired."
          });
        }
      } catch (err) {
        setTokenStatus({
          isChecking: false,
          isValid: false,
          message:
            err.response?.data?.message ||
            "This password reset link is invalid or has expired."
        });
      }
    };

    validateToken();
  }, [token]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await submitForm();

      if (response?.data) {
        setResetStatus(response.data.message || "Password reset successfully!");
        setIsSuccess(
          response.data.type === "success" || response.status === 200
        );
      } else {
        setResetStatus("Password has been reset successfully!");
        setIsSuccess(true);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to reset password. Please try again.";
      setResetStatus(errorMessage);
      setIsSuccess(false);
    }
  };

  const handleRedirect = () => {
    navigate("/login");
  };

  if (tokenStatus.isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-[#ef5644] p-6 text-center">
            <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          </div>
          <div className="p-8 text-center">
            <svg
              className="animate-spin h-12 w-12 text-[#ef5644] mb-4 mx-auto"
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
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
            <p className="text-lg text-gray-600">{tokenStatus.message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenStatus.isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-[#ef5644] p-6 text-center">
            <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          </div>
          <div className="p-8 text-center">
            <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
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
            <p className="text-lg font-medium text-gray-800 mb-8">
              {tokenStatus.message}
            </p>
            <button
              onClick={handleRedirect}
              className="w-full bg-[#ef5644] hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg shadow-md"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (resetStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-[#ef5644] p-6 text-center">
            <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          </div>
          <div className="p-8 text-center">
            <div className="mx-auto mb-6 h-16 w-16 rounded-full flex items-center justify-center bg-opacity-20">
              {isSuccess ? (
                <div className="bg-green-100">
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
                <div className="bg-red-100">
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
              {resetStatus}
            </p>
            <button
              onClick={handleRedirect}
              className="w-full bg-[#ef5644] hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg shadow-md"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-[#ef5644] p-6 text-center">
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
        </div>
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.password ? "border-red-300" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-[#ef5644] focus:border-[#ef5644] sm:text-sm`}
                placeholder="Enter new password"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.confirmPassword ? "border-red-300" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-[#ef5644] focus:border-[#ef5644] sm:text-sm`}
                placeholder="Confirm new password"
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 rounded-md text-white bg-[#ef5644] hover:bg-red-700 focus:outline-none"
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>
          </form>
        </div>
        <div className="bg-gray-50 px-6 py-4 border-t text-center">
          <p className="text-xs text-gray-500">
            Remember your password?{" "}
            <button
              onClick={handleRedirect}
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

export default ResetPassword;
