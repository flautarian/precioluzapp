
import axios from 'axios';


const luzApi = axios.create({
    baseURL: 'https://api.preciodelaluz.org/v1'
});



export default luzApi;

