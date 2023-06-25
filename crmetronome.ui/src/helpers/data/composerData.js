import axios from 'axios';
import crmConfig from '../apiKeys';

const apiURL = crmConfig.apiURL;

const getAllComposers = () => new Promise((resolve, reject ) => {
  axios.get(`${apiURL}/api/composers`)
    .then((response) => {
      resolve(response.data)})
    .catch((error) => {
      reject(error)});
});

const addComposer = (composerProfile) => new Promise((resolve, reject) => {
  axios.post(`${apiURL}/api/composers`, composerProfile)
    .then((response) => {
      resolve(response.data)})
    .catch((error) => {
      reject(error)});
});
export {
  getAllComposers,
  addComposer };
