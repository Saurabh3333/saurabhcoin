const SHA256 = require('crypto-js/sha256');

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
    constructor (timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonse = 0;
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonse).toString();
    }

    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) != Array(difficulty + 1).join("0")) {
            this.nonse++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined: " + this.hash);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block(Date.parse("2017-02-07"), "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1]; 
    }

    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log("Block successfully mined");
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;

        for(const block of this.chain) {
            for(const trans of block.transactions) {
                if(trans.fromAddress === address) {
                    balance -= trans.amount;
                }

                if(trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    isChainValid() {
        for(let i = 1; i< this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash != currentBlock.calculateHash()) {
                return false;
            }

            if(currentBlock.previousHash != previousBlock.hash) {
                return false;
            }

            return true;
        }
    }
}

let ssCoin = new Blockchain();

ssCoin.createTransaction(new Transaction('address1', 'address2', 100));
ssCoin.createTransaction(new Transaction('address1', 'address2', 500));

console.log("\n Starting miner...");
ssCoin.minePendingTransactions('saurabhshubham');

console.log("\n Balance of Saurabh is", ssCoin.getBalanceOfAddress('saurabhshubham'));

console.log("\n Starting miner...");
ssCoin.minePendingTransactions('saurabhshubham');

console.log("\n Balance of Saurabh is", ssCoin.getBalanceOfAddress('saurabhshubham'));
