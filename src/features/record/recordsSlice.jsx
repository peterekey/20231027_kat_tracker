import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const loadAllRecords = createAsyncThunk(
    'records/loadAllRecords',
    async (_, { rejectWithValue } ) => {
        try {
            const data = await fetch(import.meta.env.VITE_API_URL + '/api/records')
            const json = await data.json()
            // console.log(JSON.stringify(json))
            return json
        } catch (error) {
            console.log('error: ', error)
            console.log('data:', error.response.data)
            console.log('message:', error.response.data.message)
            return rejectWithValue(error.response.data.message)
        }

    }
)

export const addNewRecord = createAsyncThunk(
    'records/addRecord',
    async (newRecord, {rejectWithValue}) => {
        try {
            console.log('trying to add new record ', newRecord)
            const response = await fetch(
                import.meta.env.VITE_API_URL + '/api/records',
                {
                    method: 'POST',
                    body: JSON.stringify(newRecord),
                    headers: {
                        'Content-type': 'application/json'
                    }
                }
            )

            const json = await response.json()
            console.log('json is ', json)
            return json
        } catch (error) {
            console.log('error: ', error)
            return rejectWithValue(error.response.data.message)
        }

    }
)

export const recordsSlice = createSlice({
    name: "records",
    initialState: {
        records: [],
        isLoadingRecords: false,
        hasError: false,
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
        .addCase(addNewRecord.fulfilled, (state, action) => {
            state.isLoadingRecords = false
            state.records = action.payload
        })
        .addCase(addNewRecord.rejected, (_, action) => {
            console.log('An error occurred: ', action.payload)
        })
    }})

export const selectAllRecords = (state) => state.records
export const isLoading = (state) => state.records.isLoadingRecords
export const hasError = (state) => state.records.hasError
export default recordsSlice.reducer;