const level = require('level')

const chainDB = './chaindata'

class LevelSandbox {
    constructor() {
        this.db = level(chainDB);
    }


    // Get data from levelDB with key (Promise)
    getLevelDBData(key) {
        let self = this;

        return new Promise(function(resolve, reject) {
            self.db.get(key, (err, value) => {
                if(err){
                    if(err.type == 'NotFoundError') {
                        resolve(undefined);
                    } else {
                        console.log('Block ' + key + ' get failed', err);
                        reject(err);
                    }
                } else {
                    resolve(value);
                }
            });
        });
    }

    // Add data to levelDB with key and value (Promise)
    addLevelDBData(key, value) {
        let self = this;
        return new Promise(function(resolve, reject) {
            self.db.put(key, value, function(err) {
                if (err) {
                    console.log('Block ' + key + ' submission failed', err);
                    reject(err);
                }
                resolve(value);
            });
        });
    }


    getBlocksCount(){
        let self = this;
    }
}

module.exports.LevelSandbox = LevelSandbox;