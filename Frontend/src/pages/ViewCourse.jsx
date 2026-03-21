import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { setSelectedCourse } from '../redux/courseSlice';
import img from "../assets/empty.jpg"
import { FaStar } from "react-icons/fa6";
import { FaPlayCircle } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { serverUrl } from '../App';
import Card from '../component/Card';
import axios from "axios";
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

function ViewCourse() {
  const navigate = useNavigate()
  const { courseId } = useParams()
  const { courseData, selectedCourse } = useSelector(state => state.course)
  const { userData } = useSelector(state => state.user)
  const dispatch = useDispatch()

  const [selectedLecture, setSelectedLecture] = useState(null)
  const [creatorData, setCreatorData] = useState("")
  const [creatoCourses, setCreatorCourses] = useState(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [loading, setLoading] =useState(false)

  const fetchCourseData = () => {
    courseData.forEach(course => {
      if (course._id === courseId) {
        dispatch(setSelectedCourse(course))
      }
    })
  }

  const checkEnrollment = () => {
    if (!userData) return;
    const verify = userData?.enrolledCourses?.some(c =>
      (typeof c === "string" ? c : c._id) === courseId
    )
    if (verify) setIsEnrolled(true)
  }

  useEffect(() => {
    fetchCourseData()
    checkEnrollment()
  }, [courseData, courseId, userData])

  useEffect(() => {
    const handleCreator = async () => {
      if (!selectedCourse?.creator) return;
      try {
        const res = await axios.post(
          `${serverUrl}/api/course/creator`,
          { userId: selectedCourse.creator },
          { withCredentials: true }
        )
        setCreatorData(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    handleCreator()
  }, [selectedCourse])

  useEffect(() => {
    if (creatorData?._id && courseData.length) {
      const creatorCourse = courseData.filter(
        c => c.creator === creatorData._id && c._id !== courseId
      )
      setCreatorCourses(creatorCourse)
    }
  }, [creatorData, courseData])

  const handleEnroll = async (userId, courseId) => {
    if (!userId) {
      toast.error("Please login first")
      return;
    }

    try {
      const res = await axios.post(
        `${serverUrl}/api/order/stripe-order`,
        { userId, courseId },
        { withCredentials: true }
      )

      //  Stripe Checkout redirect (correct for your backend)
      window.location.href = res.data.url;

    } catch (error) {
      console.log(error)
      toast.error("Unable to start payment")
    }
  }

  const handleReview = async()=>{
    setLoading(true)
    try{
      const result = await axios.post(serverUrl + '/api/review/createreview', {rating, comment, courseId}, {withCredentials:true})
      setLoading(false)
      toast.success("Review Added")
      console.log(result.data)
      setRating(0)
      setComment("")

    } catch(error){
      console.log(error)
      setLoading(false)
      toast.error(error.response.data.message)
      setRating(0)
      setComment("")
    }
  }

  const calculateAverageRevew = (reviews)=>{
    if(!reviews || reviews.length === 0){
      return 0
    }
    const total = reviews.reduce((sum, review)=>sum + review.rating, 0)
    return (total / reviews.length).toFixed(1)
  }

  const avgRating = calculateAverageRevew(selectedCourse?.reviews)

  console.log("Avg Rating: ", avgRating)

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-6xl mx-auto bg-white rounded-xl p-6 space-y-6 relative'>

        <div className='flex flex-col md:flex-row gap-6'>
          <div className='w-full md:w-1/2'>
            <FaArrowLeft
              className='text-black w-[22px] h-[22px] cursor-pointer'
              onClick={() => navigate("/")}
            />

            {selectedCourse?.thumbnail
              ? <img src={selectedCourse.thumbnail} className='rounded-xl w-full object-cover' />
              : <img src={img} className='rounded-xl w-full object-cover' />}
          </div>

          <div className='flex-1 space-y-2 mt-[20px]'>
            <h2 className='text-2xl font-bold'>{selectedCourse?.title}</h2>
            <p className='text-gray-600'>{selectedCourse?.subTitle}</p>

            <div className='flex flex-col'>
              <div className='text-yellow-500 flex items-center gap-1'>
                <FaStar />{avgRating} <span className='text-gray-400'>(1,200 Reviews)</span>
              </div>

              <span className='text-xl font-semibold'>₹{selectedCourse?.price}</span>

              <ul className='text-sm text-gray-700 pt-2'>
                <li>10+ hours of video content</li>
                <li>Lifetime access</li>
              </ul>

              {!isEnrolled ? (
                <button
                  className='bg-black text-white px-6 py-2 rounded hover:bg-gray-700 mt-3 cursor-pointer'
                  onClick={() => handleEnroll(userData?._id, courseId)}
                >
                  Enroll Now
                </button>
              ) : (
                <button
                  className='bg-black text-green-500 px-6 py-2 rounded mt-3'
                  onClick={() => navigate(`/viewlecture/${courseId}`)}
                >
                  Watch Now
                </button>
              )}
            </div>
          </div>
        </div>

        <div className='flex flex-col md:flex-row gap-6'>
          <div className='bg-white w-full md:w-2/5 p-6 rounded-2xl shadow-lg'>
            {selectedCourse?.lectures?.map((lecture, i) => (
              <button
                key={i}
                disabled={!lecture.isPreviewFree}
                onClick={() => lecture.isPreviewFree && setSelectedLecture(lecture)}
                className='flex gap-3 px-4 py-3 border rounded-lg'
              >
                {lecture.isPreviewFree ? <FaPlayCircle /> : <FaLock />}
                {lecture.lectureTitle}
              </button>
            ))}
          </div>

          <div className='bg-white w-full md:w-3/5 p-6 rounded-2xl shadow-lg'>
            {selectedLecture?.videoUrl
              ? <video src={selectedLecture.videoUrl} controls className='w-full' />
              : <span>Select a preview lecture</span>}
          </div>
        </div>

        <div className='flex flex-wrap gap-6'>
          {creatoCourses?.map((course, i) => (
            <Card key={i} {...course} />
          ))}
        </div>

      </div>
      <div className='mt-8 border-t pt-6'>
        <h2 className='text-xl font-semibold mb-2'>
          Write a Review
        </h2>
        <div className='mb-4'>
          <div className='flex gap-1 mb-2'>
            {
              [1,2,3,4,5].map((star)=>(
                <FaStar key={star} onClick={()=>setRating(star)} className={star <= rating ? 'fill-amber-300' : 'fill-gray-300'} />
              ))
            }
          </div>
          <textarea onChange={(e) => setComment(e.target.value)} value={comment} className='w-full border border-gray-300 rounded-lg p-2'
          placeholder='Write your review here...' rows={3}/>
          <button className='bg-black text-white mt-3 px-4 py-2 rounded hover:bg-gray-800' disabled={loading} onClick={()=>handleReview()}>{loading?
            <ClipLoader size={30} color='white'/>: "Submit Review"}</button>
        </div>
      </div>

        {/*for creator info */}
      <div className='flex items-center gap-4 pt-4 border-t'>
          {creatorData?. photoUrl?  <img src={creatorData?. photoUrl} alt="" className='border-1 border-gray-200 w-16 h-16 rounded-full object-cover'/> : 
          <img src={img} alt="" className='w-16 h-16 rounded-full object-cover border-1 border-gray-200'/>}
          <div>
            <h2 className='text-lg font-semibold'>{creatorData.name}</h2>
            <p className='md:text-sm text-gray-600 text-[10px]'>{creatorData?.description}</p>
            <p className='md:text-sm text-gray-600 text-[10px]'>{creatorData?.email}</p>
          </div>
        </div>

        <div>
          <p className='text-xl font-semibold mb-2'>Other publish courses by educator</p>
        </div>

        <div className='w-full transition-all duration-300 py-[20px] flex items-start justify-center lg:justify-start flex-wrap gap-6 lg:px-[80px]'>
          {
            creatoCourses?.map((course,index)=>(
              <Card key={index} thumbnail={course.thumbnail} id={course._id} price={course.price} title={course.title} category={course.category}/>
            ))
          }
        </div>
    </div>
  )
}

export default ViewCourse