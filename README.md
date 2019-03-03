# Distributed Liquidity Pool - Tests

This repo is for testing the DLP infrastructure - that is the **Kyber Fund Reserve** (which is a modified version of the original Kyber Reserve) and **Fund Wallet** which is a smart contract responisble for Raising, opperating and distibuting a Fund (which are dictated by different time periods) which feeds the Reserve. 

## Prerequisites

1. Node and NPM LTS versions `10.14.1` and `6.4.1` respectively. Download from [nodejs.org](https://nodejs.org/en/download/)

2. Truffle

Install the following verison of truffle.

```
sudo npm install -g truffle@5.0.0-beta.1
```

4. Install the rest of the NPM packages

```
npm install
```

### To Run Tests

cd into the directory and run truffle develop.
```
truffle develop
```

Within the truffle develop console test the contracts.
```
test
```
