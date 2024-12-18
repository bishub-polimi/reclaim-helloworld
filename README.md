# Reclaim Hello World Demo Application

## Getting started
You need Docker and Docker Compose.   

Clone the repository, then navigate to project directory
```
cd path-to-folder
```
Build and run Docker images with
```
docker compose up --build
```
Wait for contracts to be deployed, then the application will be available on http://localhost:3000

## Containers
- __besu__: operates a local blockchain with a single node
- __deploy__: uses hardhat to deploy Reclaim contracts for on-chain proof verification, then saves the addresses in the shared volume `shared-volume`
- __frontend__: operates a React web application that allows users to generate a webproof for driving license points and to verify it on-chain, using the contracts specified in `shared-volume`

## Configuration
You need to provide a `.env` file in `/frontend` folder with the following structure:
```env
NEXT_PUBLIC_APP_ID= #APP ID provided by Reclaim Developer Portal
NEXT_PUBLIC_APP_SECRET= #APP SECRET provided by Reclaim Developer Portal
NEXT_PUBLIC_PROVIDER_ID= #PROVIDER ID provided by Reclaim Developer Portal

NEXT_PUBLIC_CHAIN_NAME= #chain name (default Besu)
NEXT_PUBLIC_CHAIN_ID= #chain ID (default 1337)
NEXT_PUBLIC_CHAIN_URL= #chain URL (default http://besu:8545)
```
