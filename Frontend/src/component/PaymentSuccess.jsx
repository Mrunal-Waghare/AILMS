import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const courseId = searchParams.get("courseId");

        console.log("CourseId:", courseId);

        // ❗ Check if courseId exists
        if (!courseId) {
          toast.error("Missing payment data");
          return navigate("/");
        }

        // ✅ VERIFY PAYMENT (IMPORTANT: withCredentials added)
        const verifyRes = await axios.post(
          `${serverUrl}/api/order/verifypayment`,
          { courseId },
          { withCredentials: true }
        );

        console.log("VERIFY RESPONSE:", verifyRes.data);

        // ✅ UPDATE REDUX WITH UPDATED USER
        dispatch(setUserData(verifyRes.data.user));

        // ✅ SHOW SUCCESS TOAST
        toast.success("Payment Successful 🎉");

        // ✅ DELAY NAVIGATION (so toast is visible)
        setTimeout(() => {
          navigate(`/viewcourse/${courseId}`);
        }, 1500);

      } catch (error) {
        console.log("PAYMENT ERROR FULL:", error);
        console.log("ERROR RESPONSE:", error?.response?.data);

        toast.error(
          error?.response?.data?.message || "Payment verification failed"
        );

        navigate("/");
      }
    };

    verifyPayment();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-xl font-semibold text-gray-700">
        Processing Payment...
      </h1>
    </div>
  );
}

export default PaymentSuccess;