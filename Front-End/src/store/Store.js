import { configureStore } from "@reduxjs/toolkit";
import  dataSliceReducer  from "../features/data/dataSlice.js";


export const store = configureStore({
    reducer : {
        data: dataSliceReducer
    }
})