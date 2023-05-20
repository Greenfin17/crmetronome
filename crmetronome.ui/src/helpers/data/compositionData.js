import axios from 'axios';
import crmConfig from '../apiKeys';

const apiURL = crmConfig.apiURL;

const getAllCompositionsByComposer = (composerID) => new Promise((resolve, reject ) => {
  axios.get(`${apiURL}/api/compositions/composer/${composerID}`)
    .then((response) => {
      resolve(response.data)})
    .catch((error) => {
      reject(error)});
});

export default getAllCompositionsByComposer;
