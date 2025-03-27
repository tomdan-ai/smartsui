const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contract.controller');

// Routes for contract operations
router.post('/deploy', contractController.deployContract);
router.get('/:id', contractController.getContractDetails);
router.post('/mint', contractController.mintToken);
router.post('/vote', contractController.submitVote);

module.exports = router;