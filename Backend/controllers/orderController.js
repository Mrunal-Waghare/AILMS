import Stripe from "stripe";
import dotenv from "dotenv";
import Course from "../model/courseModel.js";
import User from "../model/UserModel.js";

dotenv.config();

const stripe = new Stripe(process.env.SECRET_KEY);

// CREATE CHECKOUT SESSION
export const StripeOrder = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.title,
            },
            unit_amount: Number(course.price) * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/payment-success?courseId=${courseId}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
    });

    return res.status(200).json({
      message: "Checkout session created",
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.log("🔥 STRIPE ERROR:", error);
    console.log("🔥 MESSAGE:", error.message);

    return res.status(500).json({
      message: "Stripe error",
      error: error.message
    });
  }
};


// ✅ FINAL FIXED VERIFY PAYMENT
export const verifyPayment = async (req, res) => {
  try {
    const { courseId } = req.body;

    const userId = req.user._id || req.user.userId;

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.status(404).json({ message: "User or Course not found" });
    }

    if (!user.enrolledCourses.includes(courseId)) {
      user.enrolledCourses.push(courseId);
      await user.save();
    }

    if (!course.enrolledStudents.includes(userId)) {
      course.enrolledStudents.push(userId);
      await course.save();
    }

    const updatedUser = await User.findById(userId).populate("enrolledCourses");

    return res.status(200).json({
      message: "Payment verified & course unlocked",
      user: updatedUser
    });

  } catch (error) {
    console.log("VERIFY ERROR:", error);
    return res.status(500).json({
      message: "Verification failed",
      error: error.message
    });
  }
};