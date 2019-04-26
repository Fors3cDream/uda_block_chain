/**
 *  Import crypto-js/SHA256 library
 */

const sha256 = require('crypto-js/sha256')

/**
 *  Class with a constructor for block
 */
class Block {
    constructor(data){
        this.id = 0;
        this.nonce = 144444;
        this.body = data;
        this.hash = "";
    }

    /**
     *  Step1. Implement `generateHash()`
     *  method that return the `self` block with the hash.
     * 
     * Create a Promise that resolve with `self` after you create
     * the hash of the objcet and assigned to the hash property `self.hash = ...`
     */

     generateHash() {
         // Use this to create a temporary reference of the class object
         let self = this

         var promise = new Promise(function(resolve, reject) {
            var str_obj = JSON.stringify(self);
            self.hash = sha256(str_obj);
            if (self.hash){
                resolve(self);
            } else {
                reject(Error("Not get Block Hash"));
            }
         })

         return promise;

     }
}

// Explorting the class Block to the reuse in other files
module.exports.Block = Block