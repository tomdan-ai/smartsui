const walrusStorage = require('../../../storage/walrusStorage');
const path = require('path');
const fs = require('fs');
const os = require('os');

class StorageService {
  /**
   * Upload metadata for NFT/Token/DAO
   * @param {Object} metadata - Metadata object to store
   * @returns {Promise<Object>} Storage reference
   */
  async uploadMetadata(metadata) {
    try {
      // Store metadata as JSON in Walrus Protocol
      const result = await walrusStorage.storeJSON(metadata);
      
      console.log(`Metadata uploaded to Walrus Protocol with ID: ${result.id}`);
      return result;
    } catch (error) {
      console.error('Error uploading metadata:', error);
      throw error;
    }
  }

  /**
   * Upload a file to Walrus Protocol storage
   * @param {Object} file - File object (with buffer or path)
   * @param {Object} metadata - Optional metadata
   * @returns {Promise<Object>} Storage reference
   */
  async uploadFile(file, metadata = {}) {
    try {
      let fileToUpload = file;
      
      // If file is provided as a buffer, save it temporarily
      if (file.buffer) {
        const tempFilePath = path.join(os.tmpdir(), `upload-${Date.now()}-${file.originalname || 'file'}`);
        fs.writeFileSync(tempFilePath, file.buffer);
        fileToUpload = {
          path: tempFilePath,
          originalname: file.originalname || 'file'
        };
      }
      
      // Add metadata
      fileToUpload.metadata = metadata;
      
      // Upload to Walrus Protocol
      const result = await walrusStorage.uploadFile(fileToUpload);
      
      // Clean up temp file if we created one
      if (file.buffer && fileToUpload.path) {
        fs.unlinkSync(fileToUpload.path);
      }
      
      return result;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  /**
   * Link contract with its metadata/content in storage
   * @param {string} contractAddress - SUI contract address
   * @param {string} contentId - Walrus Protocol content ID
   * @returns {Promise<Object>} Link result
   */
  async linkContractToContent(contractAddress, contentId) {
    return walrusStorage.createContractLink(contractAddress, contentId);
  }

  /**
   * Retrieve metadata by ID
   * @param {string} id - Content ID in Walrus Protocol
   * @returns {Promise<Object>} Retrieved metadata
   */
  async getMetadata(id) {
    return walrusStorage.retrieveJSON(id);
  }

  /**
   * Retrieve file by ID
   * @param {string} id - Content ID in Walrus Protocol
   * @returns {Promise<Object>} Retrieved file data and metadata
   */
  async getFile(id) {
    return walrusStorage.retrieveFile(id);
  }
}

module.exports = new StorageService();