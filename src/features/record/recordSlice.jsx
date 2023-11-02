import { createSlice } from  '@reduxjs/toolkit'

const initialState = {
    records: [
        {
            datetime: 1698959750620,
            exercise: "Chest press",
            equipment: "V bar",
            reps: 8,
            weight: 20,
            difficulty: ""
        }
    ]
}

const sliceOptions = createSlice({
    name: "record",
    initialState: initialState,
    reducers: {
        addRecord: (state, action) => {
            return {
                ...state,
                records: [
                    ...state.records,
                    {
                        datetime: action.payload.datetime,
                        exercise: action.payload.exercise,
                        equipment: action.payload.equipment,
                        reps: action.payload.reps,
                        weight: action.payload.weight,
                        difficulty: action.payload.difficulty,
                    }
                ]
            }
        }
    }
})

export const recordSlice = createSlice(sliceOptions)
export const selectRecords = (state) => state.records
export const { addRecord } = recordSlice.actions
export default recordSlice.reducer