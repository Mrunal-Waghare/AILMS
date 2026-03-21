import React, { use, useState } from 'react'
import logo from '../assets/logo.jpg'
import { IoPersonCircle } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { setUserData } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import { toast } from 'react-toastify'
import { RxHamburgerMenu } from "react-icons/rx";
import { GiSplitCross } from "react-icons/gi";
import axios from 'axios'

function Nav() {
    const { userData } = useSelector(state=>state.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [show, setShow] = useState(false)
    const [showHam, setShowHam] = useState(false)


const handleLogOut = async () => {
  try {
    await axios.get(
      serverUrl + "/api/auth/logout",
      { withCredentials: true }
    );

    dispatch(setUserData(null));   // clear redux user
    setShowHam(false);             // close mobile menu
    setShow(false);                // close profile dropdown (desktop)

    toast.success("Logout Successfully");
  } catch (error) {
    console.log(error);
    toast.error(
      error.response?.data?.message || "Logout failed"
    );
  }
};
  return (
    <div>
      <div className='w-[100%] h-[70px] fixed top-0 px-[20px] py-[10px] flex items-center justify-between bg-[#00000047] z-10'>
        <div className='lg:w-[20%] w-[40%] lg:pl-[50px]'>
            <img src={logo} alt="" className='w-[60px] rounded-[5px] border-2 border-white'/>
        </div>
        <div className='w-[30%] lg:flex items-center justify-center gap-4 hidden'>
            {!userData &&<IoPersonCircle className='w-[50px] h-[50px] fill-black cursor-pointer' onClick={()=>setShow(prev=>!prev)}/>}
            {userData?.photoUrl ? (
            <img
            src={userData.photoUrl}
            onClick={() => setShow(prev => !prev)}
            className="w-[50px] h-[50px] rounded-full
            border-2 border-white cursor-pointer" 
            alt="profile"
            />
            ) : (
          <div
          onClick={() => setShow(prev => !prev)}
          className="w-[50px] h-[50px] rounded-full
          text-white flex items-center justify-center
          text-[20px] border-2 bg-black border-white cursor-pointer"
          >
          {userData?.name?.slice(0, 1).toUpperCase()}
          </div>
          )}

            {userData?.role === "educator" && <div className='px-[20px] py-[10px] border-2 lg:border-white border-black lg:text-white bg-[black]
            text-black rounded-[10px] text-[18px] font-light flex gap-2 cursor-pointer' onClick={()=>navigate("/dashboard")}>Dashboard
            </div>}
            {!userData?<span className='px-[20px] py-[10px] border-2 border-white text-white rounded-[10px]
            text-[18px] font-light cursor-pointer bg-[#000000d5]' onClick={()=>navigate("/login")}>Login
            </span>:
            <span className='px-[20px] py-[10px] bg-[white] text-black rounded-[10px] shadow-5m
            shadow-black text-[18px] cursor-pointer' onClick={handleLogOut}>LogOut</span> }
            {show && <div className='absolute top-[110%] right-[15%] flex items-center flex-col justify-center
            gap-2 text-[16px] rounded-md bg-[white] px-[15px] px-[10px] border-[2px]
            border-black hover:border-white hover:text-white cursor-pointer hover:bg-black'>
              <span className='bg-[black] text-white px-[30px] py-[10px] rounded-2xl hover:bg-gray-600' onClick={()=>navigate("/profile")}>My Profile</span>
              <span className='bg-[black] text-white px-[30px] py-[10px] rounded-2xl hover:bg-gray-600'  onClick={() => navigate("/mycourses")}>My Courses</span>
            </div>}
        </div>
        {!showHam ? (
        <RxHamburgerMenu
        className="w-[35px] h-[35px] lg:hidden text-white cursor-pointer "
        onClick={() => setShowHam(true)}
      />
      ) : (
      <GiSplitCross
        className="w-[35px] h-[35px] lg:hidden fill-white cursor-pointer z-40"
        onClick={() => setShowHam(false)}
      />
      )}

    <div
  className={`fixed top-0 left-0 w-screen h-screen bg-black/80
  flex flex-col items-center justify-center gap-6 z-30 lg:hidden
  transform transition-transform duration-500 ease-in-out
  ${showHam ? "translate-x-0" : "-translate-x-full"}`}
>

  {userData?.photoUrl ? (
  <img
    src={userData.photoUrl}
    onClick={() => setShow(prev => !prev)}
    className="w-[50px] h-[50px] rounded-full
      border border-white cursor-pointer"
    alt="profile"
  />
) : (
  <div
    onClick={() => setShow(prev => !prev)}
    className="w-[50px] h-[50px] rounded-full
      bg-black text-white border border-white
      flex items-center justify-center text-[26px] font-bold cursor-pointer"
  >
    {userData?.name?.slice(0, 1).toUpperCase()}
  </div>
)}

  {/* My Profile */}
  <div
    className="w-[220px] h-[55px]
    bg-black text-white border border-white
    rounded-xl text-lg font-medium
    flex items-center justify-center
    hover:bg-white hover:text-black
    transition duration-200"
    onClick={() => {setShowHam(false)
      navigate("/profile")}}
  >
    My Profile
  </div>
  <div
    className="w-[220px] h-[55px]
    bg-black text-white border border-white
    rounded-xl text-lg font-medium
    flex items-center justify-center
    hover:bg-white hover:text-black
    transition duration-200"
    onClick={() => navigate("/mycourses")}
  >
    My Courses
  </div>

  {/* Dashboard */}
  {/* Dashboard – Educator only */}
{userData?.role === "educator" && (
  <div
    className="w-[220px] h-[55px]
    bg-black text-white border border-white
    rounded-xl text-lg font-medium
    flex items-center justify-center
    hover:bg-white hover:text-black
    transition duration-200"
    onClick={() => {
      setShowHam(false)
      navigate("/dashboard")
    }}
  >
    Dashboard
  </div>
)}



  {!userData ? (
  <div
    className="w-[220px] h-[55px]
    bg-black text-white border border-white
    rounded-xl text-lg font-medium
    flex items-center justify-center
    hover:bg-white hover:text-black
    transition duration-200"
    onClick={() => {
      setShowHam(false)
      navigate("/login")
    }}
  >
    Login
  </div>
) : (
  <div
    className="w-[220px] h-[55px]
    bg-black text-white border border-white
    rounded-xl text-lg font-medium
    flex items-center justify-center
    hover:bg-white hover:text-black
    transition duration-200"
    onClick={handleLogOut}
  >
    LogOut
  </div>
)}
</div>
      </div>
    </div>
  )
}

export default Nav
