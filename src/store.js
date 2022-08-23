import { configureStore } from '@reduxjs/toolkit'
import brandReducer from 'reducers'
// import categoryReducer from 'reducers'

export default configureStore({
    reducer: {
        brands: brandReducer,
        // categories: categoryReducer
    }
})

// not need now because we use redux-thunk