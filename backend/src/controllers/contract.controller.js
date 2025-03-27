const blockchainService = require('../services/blockchain.service');
const storageService = require('../services/storage.service');

exports.deployContract = async (req, res) => {
  try {
    const contractConfig = req.body;
    console.log('Deploying contract with config:', contractConfig);
    
    // Store contract metadata
    const metadataResult = await storageService.uploadMetadata({
      contractType: contractConfig.type,
      name: contractConfig.name,
      description: contractConfig.description,
      created: new Date().toISOString(),
      config: contractConfig
    });
    
    // Store the metadata reference in the contract config
    contractConfig.metadataId = metadataResult.id;
    
    // Deploy the contract
    const result = await blockchainService.deployContract(contractConfig);
    
    // Link contract to metadata
    await storageService.linkContractToContent(result.contractAddress, metadataResult.id);
    
    res.status(201).json({
      success: true,
      message: 'Contract deployment initiated',
      data: {
        ...result,
        metadata: metadataResult
      }
    });
  } catch (error) {
    console.error('Error deploying contract:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deploy contract',
      error: error.message
    });
  }
};

exports.getContractDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const contractDetails = await blockchainService.getContractDetails(id);
    
    // If contract has metadata ID, fetch it
    if (contractDetails.metadataId) {
      const metadata = await storageService.getMetadata(contractDetails.metadataId);
      contractDetails.metadata = metadata;
    }
    
    res.status(200).json({
      success: true,
      data: contractDetails
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contract details',
      error: error.message
    });
  }
};

exports.mintToken = async (req, res) => {
  try {
    const { contractId, recipient, metadata } = req.body;
    
    // Store token metadata if provided
    let metadataResult = null;
    if (metadata) {
      metadataResult = await storageService.uploadMetadata(metadata);
    }
    
    // Handle file upload if included
    let fileResult = null;
    if (req.file) {
      fileResult = await storageService.uploadFile(req.file, {
        contractId,
        tokenType: 'NFT',
        createdAt: new Date().toISOString()
      });
    }
    
    // Mint the token with metadata/file references
    const mintResult = await blockchainService.mintToken(contractId, recipient, {
      metadataId: metadataResult?.id,
      fileId: fileResult?.id
    });
    
    res.status(200).json({
      success: true,
      message: 'Token minted successfully',
      data: {
        mint: mintResult,
        metadata: metadataResult,
        file: fileResult
      }
    });
  } catch (error) {
    console.error('Error minting token:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mint token',
      error: error.message
    });
  }
};

exports.submitVote = async (req, res) => {
  try {
    const { daoId, proposalId, vote, voter } = req.body;
    
    // Record vote metadata in Walrus Protocol
    const voteMetadata = {
      daoId,
      proposalId,
      vote,
      voter,
      timestamp: new Date().toISOString()
    };
    
    const metadataResult = await storageService.uploadMetadata(voteMetadata);
    
    // Submit the vote on-chain
    const voteResult = await blockchainService.submitVote(daoId, proposalId, vote, voter);
    
    // Link the vote transaction to its metadata
    if (voteResult.transactionHash) {
      await storageService.linkContractToContent(voteResult.transactionHash, metadataResult.id);
    }
    
    res.status(200).json({
      success: true,
      message: 'Vote submitted successfully',
      data: {
        vote: voteResult,
        metadata: metadataResult
      }
    });
  } catch (error) {
    console.error('Error submitting vote:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit vote',
      error: error.message
    });
  }
};