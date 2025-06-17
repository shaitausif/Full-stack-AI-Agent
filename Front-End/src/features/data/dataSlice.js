import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user : {
        
    }
}


export const dataSlice = createSlice({
    name : 'data',
    initialState,
    reducers : {
        setuserData : (state, action) => {
            state.user = action.payload
        }
    }
})

// all the reducers will be here
export const  {setuserData}  = dataSlice.actions

export default dataSlice.reducer