const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
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

async function uploadToIPFS(file) {
  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(file.path));
    
    const response = await axios.post('https://api.web3.storage/upload', formData, {
      headers: {
        'Authorization': `Bearer ${process.env.WEB3_STORAGE_API_KEY}`,
        ...formData.getHeaders()
      }
    });
    
    return {
      cid: response.data.cid,
      url: `https://${response.data.cid}.ipfs.dweb.link`
    };
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
}

module.exports = {
  retrieveFromIPFS,
  uploadToIPFS
};