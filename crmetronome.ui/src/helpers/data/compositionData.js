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

const addComposition = (compositionProfile) => new Promise((resolve, reject) => {
  axios.post(`${apiURL}/api/compositions`, compositionProfile)
    .then((response) => {
      resolve(response.data)})
    .catch((error) => {
      reject(error)});
});

const deleteComposition = (compositionID) => new Promise((resolve, reject) => {
  axios.delete(`${apiURL}/api/Compositions/${compositionID}`)
    .then((response) => {
      resolve(response)})
    .catch((error) => {
      reject(error)})
});

const updateCompositionWithPatch = (compositionProfile) => new Promise((resolve, reject) => {
  axios.patch(`${apiURL}/api/compositions/${compositionProfile}`)
    .then((response) => {
      resolve(response);})
    .catch((error) => {
      reject(error);})
});

export {
  getAllCompositionsByComposer,
  addComposition,
  deleteComposition,
  updateCompositionWithPatch
};
