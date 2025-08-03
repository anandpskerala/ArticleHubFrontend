import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";
import { AxiosError } from "axios";
import type { UserData } from "../../../interfaces/entities/User";


export const changeUserDetails = createAsyncThunk(
    "auth/changeUserDetails",
    async (userData: UserData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put("/profile", userData);
            if (!response.data?.user) {
                return rejectWithValue("Invalid response from server");
            }
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                return rejectWithValue(error.response.data.message);
              }
              return rejectWithValue("Something went wrong");
        }
    }
)