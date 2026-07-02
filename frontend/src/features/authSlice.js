import {createSlice} from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: "auth",

    initialState:{
        status: false,
        userData: null
    },

    reducers:{
        sliceLogin: (state, action) => {
            state.status = true,
            state.userData = action.payload
        },
        sliceLogout: (state, action) => {
            state.status = false,
            state.userData = null
        }
    }
})


export const {sliceLogin, sliceLogout} = authSlice.actions
export default authSlice