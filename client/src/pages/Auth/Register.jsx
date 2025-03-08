import useFormData from "@/hooks/useFormData.js";
import restoApiInstance from "@/service/api/api.js";
import Toast from "@/_components/Toasts/Toast.js";

// eslint-disable-next-line react/prop-types
const Register = ({ setshowDetails }) => {
  const { data, handleChange, handleSubmit, isLoading } = useFormData(
    {
      email: "",
      password: "",
      confirmPassword: ""
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
    <div className={"flex items-center justify-center"}>
      <div className={"flex flex-col"}>
        <form onSubmit={handleRegister}>
          <div className="flex flex-col m-2">
            <label>Email</label>
            <input
              type="email"
              className={"input-box "}
              onChange={handleChange}
              name="email"
              value={data.email || ""}
              required={true}
            />
          </div>

          <div className="flex flex-col m-2 ">
            <label>Name</label>
            <input
              type="text"
              className={"input-box  "}
              onChange={handleChange}
              name="name"
              value={data.name || ""}
              required={true}
            />
          </div>

          <div className="flex flex-col m-2 ">
            <label>Phone</label>
            <input
              type="text"
              className={"input-box  "}
              onChange={handleChange}
              name="phone"
              value={data.phone || ""}
              required={true}
            />
          </div>

          <div className="flex flex-col m-2">
            <label>Password</label>
            <input
              type="password"
              className={"input-box  "}
              onChange={handleChange}
              name="password"
              value={data.password || ""}
              required={true}
            />
          </div>
          <div className="flex flex-col m-2">
            <label>Confirm Password</label>
            <input
              type="password"
              className={"input-box  "}
              onChange={handleChange}
              name="confirmPassword"
              value={data.confirmPassword || ""}
              required={true}
            />
          </div>
          <div className="flex flex-col m-2">
            <input
              type="submit"
              value={isLoading ? "Registering......." : "Register"}
              className={`btn-var-1 mt-2 kanit-500 ${
                isLoading ? "opacity-60 pointer-events-none" : ""
              }`}
              disabled={isLoading}
            />
          </div>
        </form>

        <div className={"flex items-center justify-center m-2"}>
          <button
            className={"link_button  mr-4"}
            onClick={() => setshowDetails("resendMail")}
          >
            Resend Verification Mail
          </button>
          <button
            className={"link_button"}
            onClick={() => setshowDetails("login")}
          >
            Already a member? Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
