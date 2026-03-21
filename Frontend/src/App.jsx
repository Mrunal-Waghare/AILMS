import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
export const serverUrl = "https://ailms-d77g.onrender.com"
import {ToastContainer} from "react-toastify"
import getCurrentUser from "./customeHooks/getCurrentUser";
import { useSelector } from "react-redux";
import Profile from "./pages/Profile";
import ForgetPassword from "./pages/ForgetPassword";
import EditProfile from "./pages/EditProfile";
import Dashboard from "./pages/Educator/Dashboard";
import Courses from "./pages/Educator/Courses";
import CreateCourses from "./pages/Educator/CreateCourses";
import getCreatorCourse from "./customeHooks/getCreatorCourse";
import EditCourses from "./pages/Educator/EditCourses";
import getPublishedCourse from "./customeHooks/getPublishedCourse";
import AllCourses from "./pages/AllCourses";
import CreateLecture from "./pages/Educator/CreateLecture";
import EditLecture from "./pages/Educator/EditLecture";
import ViewCourse from "./pages/ViewCourse";
import ScrollToTop from "./component/ScrollToTop";
import usePublishedCourse from "./customeHooks/getPublishedCourse";
import ViewLecture from "./pages/ViewLecture";
import MyEnrolledCourses from "./pages/MyEnrolledCourses";
import getAllReviews from "./customeHooks/getAllReviews";
import SearchWithAi from "./pages/SearchWithAi";
import PaymentSuccess from "./component/PaymentSuccess";

function App() {
  getCurrentUser()
  getCreatorCourse()
  getPublishedCourse()
  usePublishedCourse()
  getAllReviews()
  const { userData } = useSelector(state=>state.user)
  return (
    <>
    <ToastContainer />
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to={"/"} />}/>
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={userData ?  <Profile/> : <Navigate to={"/signup"}/>}/>
      <Route path="/forget" element={userData ? <ForgetPassword /> : <Navigate to={"/signup"}/>}/>
      <Route path="/editprofile" element={userData ? <EditProfile /> : <Navigate to={"/signup"}/>}/>
      <Route path="/allcourses" element={userData ? <AllCourses /> : <Navigate to={"/signup"}/>}/>

      <Route path="/dashboard" element={userData?.role === "educator" ? <Dashboard /> : <Navigate to={"/signup"}/>}/>
      <Route path="/courses" element={userData?.role === "educator" ? <Courses /> : <Navigate to={"/signup"}/>}/>
      <Route path="/createcourse" element={userData?.role === "educator" ? <CreateCourses /> : <Navigate to={"/signup"}/>}/>
      <Route path="/editcourse/:courseId" element={userData?.role === "educator" ? <EditCourses /> : <Navigate to={"/signup"}/>}/>
      <Route path="/createlecture/:courseId/:lectureId" element={userData?.role === "educator" ? <CreateLecture /> : <Navigate to={"/signup"}/>}/>
      <Route path="/editlecture/:courseId/:lectureId" element={userData?.role === "educator" ? <EditLecture /> : <Navigate to={"/signup"}/>}/>
      <Route path="/viewcourse/:courseId" element={userData ? <ViewCourse /> : <Navigate to={"/signup"}/>}/>
      <Route path="/viewlecture/:courseId" element={userData ? <ViewLecture /> : <Navigate to={"/signup"}/>}/>
      <Route path="/mycourses" element={userData ? <MyEnrolledCourses /> : <Navigate to={"/signup"}/>}/>
      <Route path="/search" element={userData ? <SearchWithAi /> : <Navigate to={"/signup"}/>}/>
      <Route path="/payment-success" element={<PaymentSuccess />} />
    </Routes>
    </>
  );
}

export default App;
