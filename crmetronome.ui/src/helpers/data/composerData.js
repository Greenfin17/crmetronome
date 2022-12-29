import axios from 'axios';
import {crmConfig} from '../apiKeys';

const apiURL = crmConfig.apiURL;

const getAllComposers = () => new Promise((resolve, reject ) => {
  axios.get(`${apiURL}/api/composers`)
    .then((response) => resolve(response.data))
    .catch((error) => reject(error));
});

export default getAllComposers;
