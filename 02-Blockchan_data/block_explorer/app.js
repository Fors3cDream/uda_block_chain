const be = require("blockexplorer");

function getBlock(index)
{
    let Hash;
    be.blockIndex(index).then((result) => {
        Hash = JSON.parse(result).blockHash;
        console.log("Hash is " + Hash);
        let Block = be.block(Hash);
        console.log("Block :" + JSON.stringify(Block));
    }).catch((err)=>{
        throw err;
    })

    
}

(function theLoop(i) {
    setTimeout(function() {
        getBlock(i);
        i++;
        if (i < 3) theLoop(i);
    }, 3000);
})(0);