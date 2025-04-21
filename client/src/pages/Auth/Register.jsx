import useFormData from "@/hooks/useFormData.js";
import restoApiInstance from "@/service/api/api.js";
import Toast from "@/_components/Toasts/Toast.js";
import REGISTER_IMG from "../../assets/images/login_img.jpg";

// eslint-disable-next-line react/prop-types
const Register = ({ setshowDetails }) => {
  const { data, handleChange, handleSubmit, isLoading } = useFormData(
    {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      phone: ""
    },
    restoApiInstance.registerUser
  );

  const handleRegister = async (e) => {
    e.preventDefault();
    if (data.password !== data.confirmPassword) {
      Toast({ type: "error", message: "Passwords must be same" });
      return;
    }
    const response = await handleSubmit();
    if (response) {
      Toast({ type: response.type, message: response.message });
    }
  };

  return (
    <div className="flex items-center justify-center w-full py-8">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Restaurant Image Side */}
        <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center relative">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <img
            src={REGISTER_IMG}
            alt="Restaurant food display"
            className="object-cover h-full w-full rounded-lg"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
            <h2 className="text-white text-3xl font-bold">Join Us Today</h2>
            <p className="text-white text-lg mt-2">
              Create an account to start your dining experience
            </p>
          </div>
        </div>

        {/* Register Form Side */}
        <div className="w-full md:w-1/2 p-8 md:p-10">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              Create an account
            </h3>
            <p className="text-gray-600 mt-2">
              Fill in your details to register
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ef5644] focus:border-transparent transition"
                onChange={handleChange}
                name="email"
                value={data.email || ""}
                placeholder="your@email.com"
                required={true}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ef5644] focus:border-transparent transition"
                onChange={handleChange}
                name="name"
                value={data.name || ""}
                placeholder="Your full name"
                required={true}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ef5644] focus:border-transparent transition"
                onChange={handleChange}
                name="phone"
                value={data.phone || ""}
                placeholder="Your phone number"
                required={true}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ef5644] focus:border-transparent transition"
                onChange={handleChange}
                name="password"
                value={data.password || ""}
                placeholder="••••••••"
                required={true}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ef5644] focus:border-transparent transition"
                onChange={handleChange}
                name="confirmPassword"
                value={data.confirmPassword || ""}
                placeholder="••••••••"
                required={true}
              />
            </div>

            <div className="pt-2">
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
                    <span>Registering...</span>
                  </div>
                ) : (
                  "Register"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              className="text-sm text-[#ef5644] hover:text-red-700 transition"
              onClick={() => setshowDetails("resendMail")}
            >
              Resend Verification Email
            </button>
            <button
              className="text-sm text-[#ef5644] hover:text-red-700 transition"
              onClick={() => setshowDetails("login")}
            >
              Already a member? Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
