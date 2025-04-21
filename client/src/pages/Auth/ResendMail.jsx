import useFormData from "@/hooks/useFormData.js";
import restoApiInstance from "@/service/api/api.js";
import Toast from "@/_components/Toasts/Toast.js";
import PropTypes from "prop-types";
import REGISTER_IMG from "../../assets/images/login_img.jpg";

const ResendMail = ({ setshowDetails }) => {
  const { data, handleChange, handleSubmit, isLoading, resetData } =
    useFormData(
      {
        email: ""
      },
      restoApiInstance.resendVerificationMail
    );

  const handleResend = async (e) => {
    e.preventDefault();
    if (data.email === "") {
      Toast({ type: "error", message: "Please enter email" });
      return;
    }
    const response = await handleSubmit();

    if (response) {
      Toast({ type: response.type, message: response.message });
    }
    resetData();
  };

  return (
    <div className="flex items-center justify-center w-full py-8">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Restaurant Image Side */}
        <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center  relative">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <img
            src={REGISTER_IMG}
            alt="Restaurant email verification"
            className="object-cover h-full w-full rounded-lg"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
            <h2 className="text-white text-3xl font-bold">Verify Your Email</h2>
            <p className="text-white text-lg mt-2">
              {"We'll send you a verification link to get started"}
            </p>
          </div>
        </div>

        {/* Resend Form Side */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800">
              Resend Verification Email
            </h3>
            <p className="text-gray-600 mt-2">
              Enter your email address to receive a new verification link
            </p>
          </div>

          <form onSubmit={handleResend} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ef5644] focus:border-transparent transition"
                onChange={handleChange}
                name="email"
                value={data.email || ""}
                placeholder="your@email.com"
                required={true}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-[#ef5644] hover:bg-red-700 text-white font-medium py-3 rounded-lg shadow-md transition duration-200 ease-in-out ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                    <span>Sending verification email...</span>
                  </div>
                ) : (
                  "Resend Verification Email"
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Remember your account?{" "}
              <button
                onClick={() => setshowDetails("login")}
                className="font-medium text-[#ef5644] hover:text-red-700 transition"
              >
                Back to Login
              </button>
            </p>
          </div>

          <div className="mt-12 text-center">
            <p className="text-xs text-gray-500">
              {
                "If you don't receive an email within a few minutes, please check your spam folder or contact customer support for assistance."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

ResendMail.propTypes = {
  setshowDetails: PropTypes.func.isRequired
};

export default ResendMail;
