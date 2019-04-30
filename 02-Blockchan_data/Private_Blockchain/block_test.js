const BlockChain = require('./simpleChain.js');
const Block = require('./Block.js');

let myBlockChain = new BlockChain();

setTimeout(function() {
    console.log("Waiting...")
}, 10000);

(function theLoop(i) {
    setTimeout(function() {
        let blockTest = new Block("Test Block - " + (i+1));

        myBlockChain.addBlock(blockTest).then((result)=>{
            console.log(result);
            i++;
            if(i<10) theLoop(i);
        });
    }, 10000);
})(0);