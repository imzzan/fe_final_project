import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./page/Register";
import WebLogin from "./page/WebLogin";
import Otp from "./page/otp";
import ResetPassword from "./page/ResetPassword";
import ForgetPassword from "./page/ForgetPassword";
import Home from "./page/Home";
import NotificationUser from "./page/ProfileUser/NotificationUsers";
import MyClass from "./page/MyClass";
import EditDetailAccount from "./page/ProfileUser/EditDetailAccount";
import ChangePasswordUser from "./page/ProfileUser/ChangePassword";
import PaymentHistory from "./page/ProfileUser/PaymentHistory";
import Class from "./page/Class";
import DetailClass from "./page/DetailClass";
import PaymentSuccess from "./page/PaymentSuccess";
import Payment from "./page/Payment";
import { useEffect, useState } from "react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if there is an access token in localStorage
    const accessToken = localStorage.getItem("accessToken");
    setIsAuthenticated(!!accessToken);
  }, []);

  const ProtectedRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  const AuthRoute = ({ element }) => {
    return isAuthenticated ? <Navigate to="/" /> : element;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/register"
          element={<AuthRoute element={<Register />} />}
        />
        <Route path="/login" element={<AuthRoute element={<WebLogin />} />} />
        <Route path="/otp" element={<AuthRoute element={<Otp />} />} />
        <Route
          path="/reset/password/:tokenResetPassword"
          element={<ResetPassword />}
        />
        <Route
          path="/myclass"
          element={<ProtectedRoute element={<MyClass />} path="/myclass" />}
        />
        <Route path="/class" element={<Class />} />
        <Route path="/detailclass/:id" element={<DetailClass />} />
        <Route
          path="/forgetPassword"
          element={<AuthRoute element={<ForgetPassword />} />}
        />
        <Route
          path="/notification"
          element={
            <ProtectedRoute
              element={<NotificationUser />}
              path="/notification"
            />
          }
        />
        <Route
          path="/editdetailaccount"
          element={
            <ProtectedRoute
              element={<EditDetailAccount />}
              path="/editdetailaccount"
            />
          }
        />
        <Route
          path="/changepassword"
          element={
            <ProtectedRoute
              element={<ChangePasswordUser />}
              path="/changepassword"
            />
          }
        />
        <Route
          path="/paymenthistory"
          element={
            <ProtectedRoute
              element={<PaymentHistory />}
              path="/paymenthistory"
            />
          }
        />
        <Route path="/payment/:id" element={<Payment />} />
        <Route path="/paymentsuccess" element={<PaymentSuccess />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
