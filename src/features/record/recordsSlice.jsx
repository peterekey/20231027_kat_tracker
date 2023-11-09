import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const loadAllRecords = createAsyncThunk(
    'records/loadAllRecords',
    async () => {
        const data = await fetch('/api/records')
        const json = await data.json()
        return json
    }
)
export const recordsSlice = createSlice({
    name: "records",
    initialState: {
        records: [],
        isLoadingRecords: false,
        hasError: false
    },
    extraReducers: (builder) => {
        builder
        .addCase(loadAllRecords.pending, (state) => {
            state.isLoadingRecords = true
            state.hasError = false
        })
        .addCase(loadAllRecords.fulfilled, (state, action) => {
            state.isLoadingRecords = false
            state.records = action.payload
        })
        .addCase(loadAllRecords.rejected, (state) => {
            state.isLoadingRecords = false
            state.hasError = true
            state.records = []
        })
    }})


export const selectAllRecords = (state) => state.records
export const isLoading = (state) => state.records.isLoadingRecords
export const hasError = (state) => state.records.hasError
export default recordsSlice.reducer;
