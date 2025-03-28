<p align="center">
  <img src="./storage/smartsui.jpeg" alt="SMARTSUI Logo" width="300"/>
</p>

# SMARTSUI: No-Code Smart Contract Builder on SUI

## Project Overview

SMARTSUI is a No-Code Smart Contract Builder that enables non-technical users to easily create and deploy Fungible Tokens (FTs), NFTs, and DAOs on the SUI blockchain through an intuitive drag-and-drop interface.

This repository contains the backend and blockchain components of the SMARTSUI platform, which handles contract generation, deployment, and storage management using Walrus Protocol.

## Current Implementation Status

### What's Been Implemented

- ✅ Backend server structure (Express.js)
- ✅ SUI Move smart contract templates for:
  - Fungible Tokens
  - NFTs
  - DAOs
- ✅ Walrus Protocol integration for decentralized storage
- ✅ API endpoints for contract deployment, retrieval, minting, and governance
- ✅ Service layer for blockchain and storage interactions
- ✅ Development environment configuration

### Directory Structure

```
smartsui/
├── backend/                # Backend server
│   ├── src/
│   │   ├── controllers/    # API controllers
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic services
│   │   └── server.js       # Express server entry point
│   ├── .env                # Environment variables
│   ├── nodemon.json        # Development config
│   └── package.json        # Dependencies
├── blockchain/             # SUI Move contracts
│   ├── contracts/          # Contract templates
│   │   ├── DAO.move        # DAO contract template
│   │   ├── NFT.move        # NFT contract template
│   │   └── Token.move      # Fungible Token template
│   ├── scripts/            # Deployment scripts
│   └── build/              # Compiled contracts
└── storage/                # Storage management
    └── walrusStorage.js    # Walrus Protocol integration
```

## Technology Stack

- **Backend**: Node.js, Express.js
- **Blockchain**: SUI Move, SUI SDK
- **Storage**: Walrus Protocol
- **Database**: PostgreSQL (setup pending)
- **Development Tools**: Nodemon, TypeScript

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- SUI CLI
- PostgreSQL (for production)

### Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/smartsui.git
   cd smartsui
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=3001
   SUI_RPC_URL=https://fullnode.devnet.sui.io:443
   WALLET_PRIVATE_KEY=your_private_key_here
   DATABASE_URL=postgres://user:password@localhost:5432/smartsui
   WALRUS_API_KEY=your_walrus_api_key_here
   WALRUS_API_URL=https://api.walrus.network
   ```

4. Start the development server:
   ```bash
   cd backend
   npm run dev
   ```

The server will be available at http://localhost:3001. You can check the health endpoint at http://localhost:3001/health.

## Next Steps

### Blockchain Integration
- [ ] Complete the `blockchain.service.js` implementation with proper SUI SDK integration
- [ ] Add contract compilation and deployment with dynamic parameter substitution
- [ ] Implement proper transaction handling and error management

### Storage Implementation
- [ ] Get production Walrus Protocol API keys
- [ ] Add proper error handling and retries for storage operations
- [ ] Implement metadata versioning and content addressing

### Database Setup
- [ ] Set up PostgreSQL/Supabase schema
- [ ] Create models for contracts, transactions, and users
- [ ] Implement data access layer

### Frontend Integration
- [ ] Create API documentation for frontend developers
- [ ] Add CORS configuration for frontend domains
- [ ] Implement WebSocket for real-time updates

### Testing & Security
- [ ] Write unit tests for API endpoints and services
- [ ] Implement authentication and authorization
- [ ] Add input validation and sanitization
- [ ] Security audit of smart contracts

### DevOps
- [ ] Set up CI/CD pipeline
- [ ] Create Docker configuration
- [ ] Configure production deployment

## API Endpoints

- `POST /api/contracts/deploy` - Deploy a new smart contract
- `GET /api/contracts/:id` - Get contract details
- `POST /api/contracts/mint` - Mint tokens/NFTs
- `POST /api/contracts/vote` - Submit a vote in a DAO

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## License

MIT

For more information or assistance, please contact the project maintainers.