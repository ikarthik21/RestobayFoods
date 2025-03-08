import useFormData from "@/hooks/useFormData.js";
import restoApiInstance from "@/service/api/api.js";
import Toast from "@/_components/Toasts/Toast.js";
import PropTypes from "prop-types";

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
      alert("Please enter email");
      return;
    }

    const response = await handleSubmit();
    if (response.data) {
      Toast({ type: response.data.type, message: response.data.message });
    }

    resetData();
  };

  return (
    <div className={"flex items-center justify-center"}>
      <div className={"flex flex-col"}>
        <form onSubmit={handleResend}>
          <div className="flex flex-col m-2 ">
            <label>Email</label>
            <input
              type="email"
              className={"input-box w-72"}
              onChange={handleChange}
              name="email"
              required={true}
            />
          </div>

          <div className="flex flex-col m-2">
            <input
              type="submit"
              value={isLoading ? "Resending......" : "Resend"}
              className={`btn-var-1 mt-2 ${
                isLoading ? "opacity-60 pointer-events-none" : ""
              }`}
              disabled={isLoading}
            />
          </div>
        </form>

        <div className={"flex items-center justify-center m-2"}>
          <button
            className={"link_button"}
            onClick={() => setshowDetails("login")}
          >
            Already a Member? Login
          </button>
        </div>
      </div>
    </div>
  );
};

ResendMail.propTypes = {
  setshowDetails: PropTypes.func.isRequired
};

export default ResendMail;
