import { configureStore } from "@reduxjs/toolkit"
import recordsReducer from '../features/record/recordsSlice'

const store = configureStore({
    reducer: {
        records: recordsReducer
    }
})

export const setupStore = preloadedState => {
    return configureStore({
        reducer: recordsReducer,
        preloadedState
    })
}

export default store