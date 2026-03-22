import { configureStore } from '@reduxjs/toolkit'
import userSlice from "./userSlice"
import courseSlice from "./courseSlice"
import lectureReducer from "./lectureSlice"
import reviewSlice from './reviewSlice'

export const store = configureStore({
    reducer:{
        user: userSlice,
        course: courseSlice,
        lecture: lectureReducer, 
        review: reviewSlice
    }
})