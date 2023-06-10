import axios from 'axios';
import crmConfig from '../apiKeys';

const apiURL = crmConfig.apiURL;

const GetSequence = (excerptID) => new Promise ((resolve,reject) =>{
  axios.get(`${apiURL}/api/segments/excerpt/${excerptID}`)
    .then((response) => {
      resolve(response.data)})
    .catch((error) =>{
      reject(error)});
  });

  export default GetSequence;
