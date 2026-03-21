import User from "../model/UserModel.js"
import { uploadOnCloudinary } from "../config/cloudinary.js"

// GET CURRENT USER
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User
            .findById(req.userId)
            .select("-password").populate("enrolledCourses")

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        return res.status(200).json(user)

    } catch (error) {
        return res.status(500).json({
            message: `getCurrentUser error: ${error.message}`
        })
    }
}

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, description } = req.body;

        const updateData = { name, description };

        // Upload photo if a file is provided
        if (req.file) {
            const photoUrl = await uploadOnCloudinary(req.file.path);
            updateData.photoUrl = photoUrl; // use the string directly
        }

        // Update user and return updated object
        const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);

    } catch (error) {
        return res.status(500).json({
            message: `updateProfile error: ${error.message}`
        });
    }
};
