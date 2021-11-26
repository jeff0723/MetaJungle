# Bullosseum

## Usage
clone repo
```
git clone https://github.com/jeff0723/bulls-and-bears.git
cd bulls-and-bears
```

test contracts
```
yarn
yarn compile
yarn deploy
yarn test
```

create file named `.env` under `./package/react-app` like this
```
REACT_APP_MORALIS_APPLICATION_ID=<MORALIS APP ID>
REACT_APP_MORALIS_SERVER_URL=<SERVER URL>
```

run frontend
```
yarn start
```

## Contracts path
```
./packages/hardhat/contracts
```