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

const deleteExcerpt = (excerptID) => new Promise((resolve, reject) => {
  axios.delete(`${apiURL}/api/excerpts/${excerptID}`)
    .then((response) => {
      resolve(response)})
    .catch((error) => {
      reject(error)})
});

export { 
  getExcerptsByCompositionID,
  deleteExcerpt
};
