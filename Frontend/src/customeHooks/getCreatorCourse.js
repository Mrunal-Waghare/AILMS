import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCreatorCourseData } from "../redux/courseSlice";
import { serverUrl } from "../App";

const useCreatorCourse = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userData) return;

    const creatorCourses = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/course/getcreator`,
          { withCredentials: true }
        );

        console.log("Creator courses:", result.data);
        dispatch(setCreatorCourseData(result.data.courses));
      } catch (error) {
        console.log(error.response?.data || error.message);
      }
    };

    creatorCourses();
  }, [userData, dispatch]);
};

export default useCreatorCourse;
