export default (brands = [], action) => {
    switch (action.type) {
        case 'ADD_BRAND':
            return [...brands, action.payload];
        case 'REMOVE_BRAND':
            return brands.filter(brand => brand._id !== action.payload);
        case 'GET_BRANDS':
            return action.payload;
        default:
            return brands;
    }
}