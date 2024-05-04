import { configureStore } from "@reduxjs/toolkit";
import userReducer from './reducers/auth.reducer'

export const store = configureStore({
    reducer :{
        user : userReducer
    }
})