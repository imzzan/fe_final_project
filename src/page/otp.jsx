import { logo } from "../assets";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const Otp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const emailParts = email.split("@");
  const hiddenEmail =
    emailParts.length === 2
      ? `${emailParts[0].charAt(0)}${"*".repeat(
          emailParts[0].length - 2
        )}${emailParts[0].charAt(emailParts[0].length - 1)}@${emailParts[1]}`
      : email;
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(300);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [accessToken, setAccessToken] = useState(
    location.state?.accessToken || localStorage.getItem("accessToken") || ""
  );
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const storedToken =
      location.state?.accessToken || localStorage.getItem("accessToken");

    if (storedToken) {
      setAccessToken(storedToken);
    }
  }, [location.state]);

  useEffect(() => {
    let timer;

    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else {
      setResendDisabled(false);
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [countdown]);

  const showAlert = (type, message) => {
    setNotification({
      type,
      message,
    });

    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://befinalprojectbinar-production.up.railway.app/api/otp",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code1: otp[0],
            code2: otp[1],
            code3: otp[2],
            code4: otp[3],
            code5: otp[4],
            code6: otp[5],
          }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();

        if (responseData.status === "OK") {
          console.log("OTP verification successful");
          console.log(responseData.message);

          showAlert("success", responseData.message);

          navigate("/");
        } else {
          console.error("OTP verification failed");
          console.error(responseData.message);

          showAlert("error", responseData.message);
        }
      } else {
        const errorData = await response.json();
        console.error("Error during OTP verification:", errorData.message);
        showAlert("error", errorData.message);
      }
    } catch (error) {
      console.error("Error during OTP verification:", error.message);
      showAlert("error", error.message);
    }
  };

  const handleResend = async () => {
    try {
      setResendDisabled(true);
      setCountdown(300);

      const storedToken = localStorage.getItem("accessToken");

      if (!storedToken) {
        console.error("Access token not found");
        setResendDisabled(false);
        return;
      }

      const response = await fetch(
        "https://befinalprojectbinar-production.up.railway.app/api/otp",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        console.log("OTP resent successfully");

        const newToken = response.headers.get("new_access_token");
        if (newToken) {
          localStorage.setItem("accessToken", newToken);
          setAccessToken(newToken);
        }
      } else {
        console.error("Failed to resend OTP");
        setResendDisabled(false);
      }
    } catch (error) {
      console.error("Error while resending OTP", error);
      setResendDisabled(false);
    }
  };

  const inputRefs = [
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
  ];

  const handleInputChange = (index, value) => {
    setOtp((prev) => {
      const newOtp = [...prev];
      newOtp[index] = value;

      if (value && index < inputRefs.length - 1) {
        inputRefs[index + 1].current.focus();
      }

      return newOtp;
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
      {/* Left Section */}
      <div className="p-4 lg:p-10 flex items-center justify-center mx-4 lg:mx-9 bg-white relative">
        <div className="w-full max-w-md">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6 text-indigo-600 self-start">
            Masukkan OTP
          </h2>
          <p className="text-gray-600 mb-2 lg:mb-4">
            Ketik 6 digit kode yang dikirimkan ke {hiddenEmail}
          </p>
          {/* Notif Responsive */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 flex items-center justify-center mb-4">
            {notification && (
              <div
                className={`text-${
                  notification.type === "success" ? "green" : "red"
                }-500 bg-${
                  notification.type === "success" ? "green" : "red"
                }-100 p-2 rounded-xl`}
              >
                {notification.message}
              </div>
            )}
          </div>

          <form className="space-y-4">
            <div className="flex items-center space-x-2 lg:space-x-4 justify-center mt-6 lg:mt-16 mb-6 lg:mb-11">
              {inputRefs.map((ref, index) => (
                <input
                  key={index}
                  type="text"
                  className="p-2 lg:p-3 h-10 lg:h-11 w-10 lg:w-11 border rounded-md pl-2 lg:pl-3 pr-2 lg:pr-3 text-sm lg:text-base"
                  style={{
                    borderRadius: "12px",
                  }}
                  placeholder=""
                  maxLength="1"
                  value={otp[index] || ""}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  ref={ref}
                />
              ))}
            </div>

            <div className="flex justify-center items-center text-gray-600 mb-6 lg:mb-12 whitespace-nowrap">
              <p className="text-xs lg:text-sm">
                Kirim Ulang OTP dalam {Math.floor(countdown / 60)} menit{" "}
                {countdown % 60} detik
              </p>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendDisabled}
                className="ml-2 text-indigo-600 text-xs lg:text-sm"
              >
                Kirim Ulang
              </button>
            </div>
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full py-2 lg:py-3 px-4 lg:px-6 bg-indigo-600 text-white rounded hover:bg-indigo-600"
              style={{ borderRadius: "12px" }}
            >
              Simpan
            </button>
            {/* Notif Dekstop */}
            <div className="hidden lg:flex items-center justify-center absolute bottom-4 left-1/2 transform -translate-x-1/2">
              {notification && (
                <div
                  className={`text-${
                    notification.type === "success" ? "green" : "red"
                  }-500 bg-${
                    notification.type === "success" ? "green" : "red"
                  }-100 p-2 rounded-xl`}
                >
                  {notification.message}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden lg:flex bg-[#6148FF] items-center justify-center text-white">
        <img
          src={logo}
          alt="Logo"
          className="text-2xl lg:text-3xl font-semibold"
          style={{ width: "400px" }}
        />
      </div>
    </div>
  );
};

export default Otp;
