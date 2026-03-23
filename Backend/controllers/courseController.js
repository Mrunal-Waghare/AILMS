import uploadOnCloudinary from "../config/cloudinary.js"
import Course from "../model/courseModel.js";
import Lecture from "../model/lectureModel.js";
import User from "../model/UserModel.js";


export const createCourse = async (req, res) => {
    try{
        const {title, category} = req.body;
        if(!title || !category){
            return res.status(400).json({message: "Title and Category are required"});
        }
        const course = await Course.create({
            title,
            category,
            creator: req.userId,

        })
        return res.status(201).json({message: "Course created successfully", course});
    } catch(error){
        return res.status(500).json({message: "Error creating course", error});
    }
}

export const getPublishedCourses = async (req, res) => {
    try{
        const courses = await Course.find({isPublished: true}).populate("lectures reviews")
        if(!courses){
            return res.status(404).json({message: "No published courses found"});
        }
        return res.status(200).json({message: "Published courses retrieved successfully", courses});

    } catch(error){
        return res.status(500).json({message: "Error retrieving published courses", error});
    }
}


export const getCreatorCourses = async (req, res) => {
    try{
        const userId = req.userId;
        const courses = await Course.find({creator: userId});
        if(!courses){
            return res.status(404).json({message: "No courses found for this creator"});
        }
        return res.status(200).json({message: "Creator courses retrieved successfully", courses});
    } catch(error){
        return res.status(500).json({message: "Error retrieving creator courses", error});
    }
}


export const editCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, subTitle, description, category, level, price, isPublished } = req.body;

    let thumbnail;

    // ✅ HANDLE FILE SAFELY (Render fix)
    if (req.file) {
      console.log("FILE:", req.file); // 🔥 Debug log

      const filePath = req.file.path || req.file.buffer; // works for both cases
      thumbnail = await uploadOnCloudinary(filePath);
    }

    // ✅ CHECK COURSE
    let course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // ✅ SAFE UPDATE OBJECT (avoid undefined issues)
    const updateData = {};

    if (title) updateData.title = title;
    if (subTitle) updateData.subTitle = subTitle;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (level) updateData.level = level;
    if (price) updateData.price = price;
    if (isPublished !== undefined) updateData.isPublished = isPublished;
    if (thumbnail) updateData.thumbnail = thumbnail;

    // ✅ UPDATE COURSE
    course = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });

    return res.status(200).json({
      message: "Course updated successfully",
      course,
    });

  } catch (error) {
    // 🔥 VERY IMPORTANT DEBUG
    console.log("EDIT COURSE ERROR:", error);

    return res.status(500).json({
      message: "Error updating course",
      error: error.message,
    });
  }
};




export const getCourseById = async (req, res) => {
    try{
        const {courseId} = req.params
        let course = await Course.findById(courseId)
        if(!course){
            return res.status(404).json({message: "Course not found"});
        }
        return res.status(200).json({message: "Course retrieved successfully", course});
    } catch(error){
        return res.status(500).json({message: "Error retrieving course", error});
    }
}



export const removeCourse = async (req, res) => {
    try{
        const {courseId} = req.params
        let course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({message: "Course not found"});
        }
        course = await Course.findByIdAndDelete(courseId, {new: true});
        return res.status(200).json({message: "Course removed successfully"});
    } catch(error){
        return res.status(500).json({message: "Error removing course", error});
    }
}



// for lectures
export const createLecture = async (req, res) => {
    try {
        const { lectureTitle } = req.body;
        const { courseId } = req.params;

        if (!lectureTitle || !courseId) {
            return res.status(400).json({ message: "lectureTitle and courseId are required" });
        }

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const lecture = await Lecture.create({
            lectureTitle,
            course: courseId   // ✅ FIXED
        });

        course.lectures.push(lecture._id);

        await course.save();
        await course.populate("lectures");

        return res.status(201).json({ lecture, course });

    } catch (error) {
        console.log(error); // 🔥 VERY IMPORTANT
        return res.status(500).json({ message: "failed to create lecture", error: error.message });
    }
};

export const getCourseLecture = async(req, res)=>{
    try{
        const {courseId} = req.params
        const course = await Course.findById(courseId)
        if(!course){
            return res.status(404).json({message:`Course is not found ${error}`})
        }
        await course.populate("lectures")
        await course.save()
        return res.status(200).json(course)
    } catch(error){
         return res.status(404).json({message:`failed to get lectures ${error}`})
    }
}


export const editLecture = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const { isPreviewFree, lectureTitle } = req.body;

        const lecture = await Lecture.findById(lectureId);

       if (!lecture) {
        return res.status(404).json({ message: "Lecture is not found" });
        }
        // upload video safely
        if (req.file) {
            const filePath = req.file.path || req.file.buffer;
            const videoUrl = await uploadOnCloudinary(filePath);
            lecture.videoUrl = videoUrl;
        }

        if (lectureTitle) {
            lecture.lectureTitle = lectureTitle;
        }

        if (isPreviewFree !== undefined) {
            lecture.isPreviewFree = isPreviewFree;
        }

        await lecture.save();

        return res.status(200).json({
            message: "Lecture updated successfully",
            lecture
        });

    } catch (error) {
        console.log("EDIT LECTURE ERROR:", error);

        return res.status(500).json({
            message: "Failed to edit lecture",
            error: error.message
        });
    }
};

export const removeLecture = async(req, res)=>{
    try{
        const {lectureId} = req.params
        const lecture = await Lecture.findOneAndDelete(lectureId)
        if(!lecture){
            return res.status(404).json({message: "Lecture is not found"})
        }
        await Course.updateOne(
            {lectures:lectureId},
            {$pull:{lectures:lectureId}}
        )
        return res.status(200).json({message: 'Lecture Removed'})

    } catch(error){
        return res.status(404).json({message:`failed to remove lectures ${error}`})
    }
}




//get creator
export const getCreatorById = async(req, res)=>{
    try{
        const {userId} = req.body

        const user = await User.findById(userId).select("-password")

        if(!user){
            return res.status(404).json({message:"User is not found"})
        }
        return res.status(200).json(user)
    } catch(error){
        return res.status(500).json({message:`Failed to get creator ${error}`})
    }
}
