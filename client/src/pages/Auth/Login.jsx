import useFormData from "@/hooks/useFormData.js";
import { useState } from "react";
import useAuthStore from "@/store/use-auth.js";
import restoApiInstance from "@/service/api/api.js";
import { restoClient } from "../../service/api/api";
import Toast from "@/_components/Toasts/Toast";
import BlockWrapper from "@/_components/Wrappers/BlockWrapper";
import Register from "./Register";
import ResendMail from "./ResendMail";
import { useNavigate } from "react-router-dom";
import LOGIN_IMG from "../../assets/images/login_img.jpg";

const Login = () => {
  const [showDetails, setshowDetails] = useState("login");
  const navigate = useNavigate();
  const { setAccessToken } = useAuthStore();
  const { handleChange, data, handleSubmit, isLoading } = useFormData(
    {
      email: "",
      password: ""
    },
    restoApiInstance.loginUser
  );

  const handleLogin = async (e) => {
    try {
      e.preventDefault();

      const response = await handleSubmit();

      if (response) {
        if (response.accessToken) {
          setAccessToken(response.accessToken);
          restoClient.defaults.headers[
            "Authorization"
          ] = `Bearer ${response.accessToken}`;
          navigate("/menu");
        }

        Toast({ type: response.type, message: response.message });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <BlockWrapper>
      {showDetails === "login" && (
        <div className="flex items-center justify-center w-full py-8">
          <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-black opacity-10"></div>
              <img
                src={LOGIN_IMG}
                alt="Restaurant ambiance"
                className="object-cover h-full w-full rounded-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                <h2 className="text-white text-3xl font-bold">Welcome Back</h2>
                <p className="text-white text-lg mt-2">
                  Sign in to continue your culinary journey
                </p>
              </div>
            </div>

            <div className="w-full md:w-1/2 p-8 md:p-12">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Sign in to your account
                </h3>
                <p className="text-gray-600 mt-2">
                  Enter your details to access your account
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ef5644] focus:border-transparent transition"
                    onChange={handleChange}
                    name="email"
                    value={data.email}
                    placeholder="your@email.com"
                    required={true}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <a
                      href="#"
                      className="text-xs text-[#ef5644] hover:text-red-700"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <input
                    type="password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ef5644] focus:border-transparent transition"
                    onChange={handleChange}
                    name="password"
                    value={data.password}
                    placeholder="••••••••"
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
                        <span>Logging In...</span>
                      </div>
                    ) : (
                      "Log In"
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  {"Don't have an account?"}{" "}
                  <button
                    onClick={() => setshowDetails("register")}
                    className="font-medium text-[#ef5644] hover:text-red-700 transition"
                  >
                    Register now
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDetails === "register" && (
        <Register setshowDetails={setshowDetails} />
      )}
      {showDetails === "resendMail" && (
        <ResendMail setshowDetails={setshowDetails} />
      )}
    </BlockWrapper>
  );
};

export default Login;
