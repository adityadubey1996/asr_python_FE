import { configureStore } from "@reduxjs/toolkit";
import userReducer from './reducers/auth.reducer';
import questionResucer from './reducers/metric.reducer';

export const store = configureStore({
    reducer :{
        user : userReducer,
        metrics: questionResucer
    }
})