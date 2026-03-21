import React, { useState, useEffect } from 'react'
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

const EditProfile = () => {
    const navigate = useNavigate();
    const { userData } = useSelector(state => state.user);
    const dispatch = useDispatch();

    const [name, setName] = useState(userData.name);
    const [description, setDescription] = useState(userData.description || "");
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(userData.photoUrl || null);
    const [loading, setLoading] = useState(false);

    // Update preview when a new file is selected
    useEffect(() => {
        if (photoFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(photoFile);
        }
    }, [photoFile]);

    const handleEditProfile = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            if (photoFile) formData.append("photoUrl", photoFile);

            const result = await axios.post(serverUrl + "/api/user/profile", formData, { withCredentials: true });

            dispatch(setUserData(result.data)); // update Redux
            setLoading(false);
            toast.success("Profile Updated Successfully");
            navigate("/profile");

        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.error(error.response?.data?.message || "Update failed");
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10'>
            <div className='bg-white rounded-2xl shadow-lg p-8 max-w-xl w-full relative'>
                <FaArrowLeft className='absolute top-[5%] w-[22px] h-[22px] cursor-pointer' onClick={() => navigate("/profile")} />
                <h2 className='text-2xl font-bold text-center text-gray-800 mb-6'>Edit Profile</h2>
                <form className='space-y-5' onSubmit={e => e.preventDefault()}>
                    <div className='flex flex-col items-center text-center'>
                        {photoPreview ? (
                            <img src={photoPreview} className='w-24 h-24 rounded-full object-cover border-4 border-black' alt="avatar" />
                        ) : (
                            <div className='w-24 h-24 rounded-full text-white flex items-center justify-center text-[30px] border-2 bg-black border-white'>
                                {userData?.name.slice(0, 1).toUpperCase()}
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="image" className='text-sm font-medium text-gray-700'>Select Avatar</label>
                        <input
                            id='image'
                            type="file"
                            name='photoUrl'
                            accept='image/*'
                            className='w-full px-4 py-2 border rounded-md text-sm'
                            onChange={(e) => setPhotoFile(e.target.files[0])}
                        />
                    </div>

                    <div>
                        <label htmlFor="name" className='text-sm font-medium text-gray-700'>Username</label>
                        <input
                            id='name'
                            type="text"
                            placeholder={userData.name}
                            className='w-full px-4 py-2 border rounded-md text-sm'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className='text-sm font-medium text-gray-700'>Email</label>
                        <input
                            readOnly
                            type="email"
                            placeholder={userData.email}
                            className='w-full px-4 py-2 border rounded-md text-sm'
                        />
                    </div>

                    <div>
                        <label htmlFor="bio" className='text-sm font-medium text-gray-700'>Bio</label>
                        <textarea
                            id='bio'
                            name='description'
                            placeholder='Tell us about yourself'
                            rows={3}
                            className='w-full mt-1 px-4 border border-gray-300 rounded-md resize-none focus:ring-2 focus-ring-[black]'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <button
                        className='w-full bg-black active:bg-[#454545] text-white py-2 rounded-md font-medium transition cursor-pointer'
                        disabled={loading}
                        onClick={() => {
                            handleEditProfile();
                        }}
                    >
                        {loading ? <ClipLoader size={30} color='white' /> : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default EditProfile;
