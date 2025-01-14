# Reclaim Hello World Demo Application

## Frontend

### Getting started
First navigate to frontend directory, then install the dependencies
```
cd path-to-folder/frontend
npm install
```
To launch the application run
```
npm run dev
```
To build the application run
```
npm run build
```
### Configuration
You need to provide a `.env` file in `/frontend` folder with the following structure:
```env
NEXT_PUBLIC_APP_ID= #APP ID provided by Reclaim Developer Portal
NEXT_PUBLIC_APP_SECRET= #APP SECRET provided by Reclaim Developer Portal
NEXT_PUBLIC_FIRST_PROVIDER_ID= #PROVIDER ID provided by Reclaim Developer Portal
NEXT_PUBLIC_SECOND_PROVIDER_ID= #PROVIDER ID provided by Reclaim Developer Portal
NEXT_PUBLIC_THIRD_PROVIDER_ID= #PROVIDER ID provided by Reclaim Developer Portal
NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS= #Token contract address
NEXT_PUBLIC_PAYMASTER_AND_BUNDLER_ENDPOINT= #Bundler with paymaster URL

NEXT_PUBLIC_CHAIN_NAME= #chain name (default Besu)
NEXT_PUBLIC_CHAIN_ID= #chain ID (default 1337)
NEXT_PUBLIC_CHAIN_URL= #chain URL (default http://besu:8545)
```

## Contracts

### Getting started
First navigate to contracts directory, then install the dependencies
```
cd path-to-folder/hardhat
npm install
```
You can deploy contracts with
```
npx hardhat ignition deploy ignition/modules/Attestor.ts --network <network-name> 
```

### Configuration
You need to provide a `.env` file in `/hardhat` folder with the following structure:
```env
PRIVATE_KEY= #Private key of the account who performs the deploy
RECLAIM_ADDRESS= #Address of Reclaim contract on the targeted network
```
