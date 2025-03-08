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
        <div className={"flex items-center justify-center"}>
          <div className={"flex flex-col"}>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col m-2">
                <label>Email</label>
                <input
                  type="email"
                  className={"input-box w-72"}
                  onChange={handleChange}
                  name="email"
                  value={data.email}
                  required={true}
                />
              </div>

              <div className="flex flex-col m-2">
                <label>Password</label>
                <input
                  type="password"
                  className={"input-box w-72"}
                  onChange={handleChange}
                  name="password"
                  value={data.password}
                  required={true}
                />
              </div>

              <div className="flex flex-col m-2">
                <input
                  type="submit"
                  value={isLoading ? "Logining In......." : "Login"}
                  className={`btn-var-1 mt-2 kanit-500 ${
                    isLoading ? "opacity-60 pointer-events-none" : ""
                  }`}
                  disabled={isLoading}
                />
              </div>
            </form>

            <div className={"flex items-center justify-center m-2"}>
              <button
                className={"link_button"}
                onClick={() => setshowDetails("register")}
              >
                Not a Member? Register
              </button>
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
