import React, { useState } from 'react'
import { FaEdit } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { serverUrl } from "../../App";
import { setLectureData } from "../../redux/lectureSlice";

function EditLecture() {
  const { courseId, lectureId } = useParams();
  const { lectureData } = useSelector(state => state.lecture);

  const selectedLecture = lectureData?.find(
    lecture => lecture._id === lectureId
  );

  const [lectureTitle, setLectureTitle] = useState(
    selectedLecture?.lectureTitle || ""
  );
  const [videoUrl, setVideoUrl] = useState(null);
  const [isPreviewFree, setIsPreviewFree] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleEditLecture = async () => {
    setLoading(true);

    try {
      const formdata = new FormData();
      formdata.append("lectureTitle", lectureTitle);
      formdata.append("video", videoUrl);
      formdata.append("isPreviewFree", isPreviewFree);

      const result = await axios.post(
        `${serverUrl}/api/course/editlecture/${lectureId}`,
        formdata,
        { withCredentials: true }
      );

      dispatch(setLectureData(result.data.lectures));
      toast.success("Lecture Updated");
      navigate(`/createlecture/${courseId}`);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const removeLecture = async () => {
    setLoading1(true);
    try {
      const result = await axios.delete(
        `${serverUrl}/api/course/deletelecture/${lectureId}`,
        { withCredentials: true });
      console.log(result.data)
      setLoading1(false);
      navigate(`/createlecture/${courseId}`);
      toast.success("Lecture Removed");

    } catch (error) {
      setLoading1(false);
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
      <div className='w-full max-w-xl bg-white rounded-xl shadow-lg p-6 space-y-6'>

        {/* Header */}
        <div className='flex items-center gap-2 mb-2'>
          <FaEdit
            className='text-gray-600 cursor-pointer'
            onClick={() => navigate(`/createlecture/${courseId}`)}
          />
          <h2 className='text-xl font-semibold text-gray-800'>
            Update Course Lecture
          </h2>
        </div>

        <button className='mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm' disabled={loading1} onClick={removeLecture}>
          {loading1 ?  <ClipLoader size={30} color='white' />:"Remove Lecture"}
        </button>

        <div className='space-y-4'>
          {/* Lecture Title */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Lecture Title *
            </label>
            <input
              type="text"
              className='w-full p-3 border border-gray-300 rounded-md text-sm
              focus:ring-2 focus:ring-black focus:outline-none'
              required
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
            />
          </div>

          {/* Video Upload */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Video *
            </label>
            <input
              type="file"
              className='w-full border border-gray-300 rounded-md p-2
              file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
              file:text-sm file:bg-gray-700 file:text-white hover:file:bg-gray-500'
              required
              accept="video/*"
              onChange={(e) => setVideoUrl(e.target.files[0])}
            />
          </div>

          {/* Free Preview */}
          <div className='flex items-center gap-3'>
            <input
              type="checkbox"
              className='accent-black h-4 w-4'
              id='isFree'
              checked={isPreviewFree}
              onChange={() => setIsPreviewFree(prev => !prev)}
            />
            <label htmlFor="isFree">Is this Video FREE</label>
          </div>

          {loading && (
            <p className='text-sm text-gray-600'>
              Uploading video... Please wait.
            </p>
          )}

          {/* Submit */}
          <div className='pt-4'>
            <button
              className='w-full bg-black text-white py-2 rounded-md text-sm
              font-medium hover:bg-gray-700 transition'
              onClick={handleEditLecture}
              disabled={loading}
            >
              {loading ? <ClipLoader size={22} color='white' /> : "Update Lecture"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default EditLecture;