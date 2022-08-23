import axios from 'axios';

// Action Creators
export const getBrands = () => async (dispatch) => {
    try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/brands`);
        dispatch({ type: 'GET_BRANDS', payload: data.brands });
    } catch (error) {
        console.log(error.message);
    }
}

export const addBrand = (newBrand) => async (dispatch) => {
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_baseURL}/brands`, newBrand);
        dispatch({ type: 'ADD_BRAND', payload: data.brand });
        console.log("data.brand: ", data.brand);
    } catch (error) {
        console.log(error.message);
    }
}


