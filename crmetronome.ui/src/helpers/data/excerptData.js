import axios from 'axios';
import crmConfig from '../apiKeys';

const apiURL = crmConfig.apiURL;

const getExcerptsByCompositionID = (compositionID) => new Promise((resolve, reject ) => {
  axios.get(`${apiURL}/api/excerpts/composition/${compositionID}`)
    .then((response) => {
      resolve(response.data)})
    .catch((error) => {
      reject(error)});
});

export default getExcerptsByCompositionID;
