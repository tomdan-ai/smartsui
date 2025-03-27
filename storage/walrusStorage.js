const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
require('dotenv').config({ path: '../backend/.env' });

/**
 * Walrus Protocol Storage Manager for SMARTSUI
 * Handles file uploads and retrievals using Walrus Protocol
 */
class WalrusStorage {
  constructor() {
    this.apiKey = process.env.WALRUS_API_KEY;
    this.baseUrl = process.env.WALRUS_API_URL || 'https://api.walrus.network';
    
    if (!this.apiKey) {
      console.warn('Warning: WALRUS_API_KEY not found in environment variables');
    }
  }

  /**
   * Upload a file to Walrus Protocol
   * @param {Object} file - File object with path and metadata
   * @returns {Promise<Object>} Upload result with reference ID
   */
  async uploadFile(file) {
    try {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(file.path));
      
      if (file.metadata) {
        formData.append('metadata', JSON.stringify(file.metadata));
      }

      const response = await axios.post(`${this.baseUrl}/v1/upload`, formData, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          ...formData.getHeaders()
        }
      });
      
      console.log('Walrus Protocol upload successful:', response.data);
      
      return {
        id: response.data.id,
        url: `${this.baseUrl}/v1/file/${response.data.id}`,
        metadata: response.data.metadata || {}
      };
    } catch (error) {
      console.error('Error uploading to Walrus Protocol:', error.message);
      throw new Error(`Walrus Protocol upload failed: ${error.message}`);
    }
  }

  /**
   * Retrieve a file from Walrus Protocol
   * @param {string} fileId - The ID of the file to retrieve
   * @returns {Promise<Object>} File data and metadata
   */
  async retrieveFile(fileId) {
    try {
      const response = await axios.get(`${this.baseUrl}/v1/file/${fileId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        responseType: 'arraybuffer'
      });
      
      const metadataResponse = await axios.get(`${this.baseUrl}/v1/metadata/${fileId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      
      return {
        data: response.data,
        metadata: metadataResponse.data,
        contentType: response.headers['content-type']
      };
    } catch (error) {
      console.error('Error retrieving from Walrus Protocol:', error.message);
      throw new Error(`Walrus Protocol retrieval failed: ${error.message}`);
    }
  }

  /**
   * Store JSON data on Walrus Protocol
   * @param {Object} data - JSON data to store
   * @returns {Promise<Object>} Upload result with reference ID
   */
  async storeJSON(data) {
    try {
      const response = await axios.post(`${this.baseUrl}/v1/json`, data, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      return {
        id: response.data.id,
        url: `${this.baseUrl}/v1/json/${response.data.id}`
      };
    } catch (error) {
      console.error('Error storing JSON on Walrus Protocol:', error.message);
      throw new Error(`Walrus Protocol JSON storage failed: ${error.message}`);
    }
  }

  /**
   * Retrieve JSON data from Walrus Protocol
   * @param {string} jsonId - The ID of the JSON to retrieve
   * @returns {Promise<Object>} The stored JSON data
   */
  async retrieveJSON(jsonId) {
    try {
      const response = await axios.get(`${this.baseUrl}/v1/json/${jsonId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error retrieving JSON from Walrus Protocol:', error.message);
      throw new Error(`Walrus Protocol JSON retrieval failed: ${error.message}`);
    }
  }

  /**
   * Create a link between contract and stored content
   * @param {string} contractAddress - SUI contract address
   * @param {string} contentId - Walrus Protocol content ID
   * @returns {Promise<Object>} Link information
   */
  async createContractLink(contractAddress, contentId) {
    try {
      const response = await axios.post(`${this.baseUrl}/v1/link`, {
        contractAddress,
        contentId
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error creating contract link in Walrus Protocol:', error.message);
      throw new Error(`Walrus Protocol link creation failed: ${error.message}`);
    }
  }
}

module.exports = new WalrusStorage();