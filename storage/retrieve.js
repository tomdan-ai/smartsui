const axios = require('axios');
require('dotenv').config({ path: '../backend/.env' });

async function retrieveFromIPFS(cid) {
  try {
    const url = `https://${cid}.ipfs.dweb.link`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error retrieving from IPFS:', error);
    throw error;
  }
}

module.exports = {
  retrieveFromIPFS
};