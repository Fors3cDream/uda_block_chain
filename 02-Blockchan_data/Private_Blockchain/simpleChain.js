const SHA256 = require('crypto-js/sha256')
const Block = require('./Block')

const db = require('level')('./chaindata')



/* ===== Blockchain ===================================
|  Class with a constructor for blockchain data model  |
|  with functions to support:                          |
|     - createGenesisBlock()                           |
|     - getLatestBlock()                               |
|     - addBlock()                                     |
|     - getBlock()                                     |
|     - validateBlock()                                |
|     - validateChain()                                |
|  ====================================================*/

class Blockchain {
    constructor() {
        this.getBlockHeight().then((height)=>{
            if(height == 1) {
                this.addBlock(new Block("Genesis block")).then(() => console.log("Genesis block added!"))
            }
        })
    }


    async addBlock(newBlock) {
        const height = parseInt(await this.getBlockHeight())

        newBlock.height = height + 1
        newBlock.time = new Date().getTime().toString().slice(0, -3)

        if(newBlock.height > 0) {
            const prevBlock = await this.getBlock(height)
            newBlock.previousBlockHash = prevBlock.hash
            console.log(`Previous Hash: 0x${newBlock.previousBlockHash}`)
        }

        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString()
        console.log(`New Hash: 0x${newBlock.hash}`)

        await this.addBlockToDB(newBlock.height, JSON.stringify(newBlock))
    }

    async getBlockHeight() {
        return await this.getBlockHeightFromDB()
    }


    async getBlock(blockHeight) {
        return JSON.parse(await this.getBlockFromDB(blockHeight))
    }

    async validateBlock(blockHeight) {
        let block = await this.getBlock(blockHeight);
        let blockHash = block.hash;
        block.hash = '';

        let validBlockHash = SHA256(JSON.stringify(block)).toString();

        if (blockHash == validBlockHash) {
            return true;
        } else {
            console.log(`Block #${blockHeight} invalid hash: ${blockHash} <--> ${validBlockHash}`);
            return false;
        }
    }

    async validateChain() {
        let errorLog = []
        let previousHash = ''
        let isValidBlock = false

        const height = await this.getBlockHeightFromDB()

        for(let i=0; i<height; i++) {
            this.getBlock(i).then((block)=>{
                isValidBlock = this.validateBlock(block.height)

                if(!isValidBlock) {
                    errorLog.push(i)
                }

                if(block.previousBlockHash != previousHash) {
                    errorLog.push(i)
                }

                previousHash = block.hash

                if(i == (height - 1)) {
                    if (errorLog.length < 0) {
                        console.log(`Block errors = ${errorLog.length}`)
                        console.log(`Blocks: ${errorLog}`)
                    } else {
                        console.log('No errors detected')
                    }
                }
            })
        }
    }


    addBlockToDB(key, value) {
        return new Promise((resolve, reject) => {
            db.put(key, value, (error) => {
                if(error) {
                    reject(error)
                }

                console.log(`Added block #${key}`)
                resolve(`Added block #${key}`)
            })
        })
    }

    getBlockFromDB(key) {
        return new Promise((resolve, reject) => {
            db.get(key, (error, value) => {
                if(error) {
                    reject(error)
                }

                resolve(value)
            })
        })
    }

    getBlockHeightFromDB() {
        return new Promise((resolve, reject) => {
            let height = -1

            db.createReadStream().on('data', (data)=> {
                height++
            }).on('error', (error)=> {
                reject(error)
            }).on('close', ()=> {
                resolve(height)
            })
        })
    }
}

// let blockchain = new Blockchain();

// (function theLoop (i) {
//     setTimeout(()=>{
//         blockchain.addBlock(new Block(`Test data ${i}`)).then(()=>{
//             if(--i) {
//                 theLoop(i)
//             }
//         })
//     }, 100);
// })(10);

// setTimeout(() => blockchain.validateChain(), 2000)

module.exports = Blockchain;