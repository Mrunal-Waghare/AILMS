import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setCourseData } from "../redux/courseSlice";

const usePublishedCourse = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getCourseData = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/course/getpublished`,
          { withCredentials: true }
        );

        dispatch(setCourseData(result.data.courses));

        console.log("Published courses:", result.data.courses);
      } catch (error) {
        console.log(error.response?.data || error.message);
      }
    };

    getCourseData();
  }, [dispatch]);
};

export default usePublishedCourse;