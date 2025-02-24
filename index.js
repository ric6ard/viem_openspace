import { createPublicClient, http } from 'viem';  
import { mainnet } from 'viem/chains';  
const client = createPublicClient({ chain: mainnet, transport: http('https://mainnet.infura.io/v3/7e5a2e302c6a454bbdc8b983088f44e4') });  

//定义合约ABI
const abi = [  
    {  
        "name": "ownerOf",  
        "inputs": [{"name": "tokenId", "type": "uint256"}],  
        "outputs": [{"name": "", "type": "address"}],  
        "stateMutability": "view",  
        "type": "function"  
    },  
    {  
        "name": "tokenURI",  
        "inputs": [{"name": "tokenId", "type": "uint256"}],  
        "outputs": [{"name": "", "type": "string"}],  
        "stateMutability": "view",  
        "type": "function"  
    }  
];  

//定义获取Owner的方法
export async function getOwnerOfTokenID(address, tokenId) {
    const owner = await client.readContract({  
        address: address,  
        abi,  
        functionName: 'ownerOf',  
        args: [tokenId]  
    });  
    return owner;
}

//定义获取Metadata URI的方法
export async function getMetadataURIOfTokenID(address, tokenId) {
    const metadataURI = await client.readContract({  
        address: address,  
        abi,  
        functionName: 'tokenURI',  
        args: [tokenId]  
    });  
    return metadataURI;
}

//定义合约地址和Token ID
const address = '0x0483b0dfc6c78062b9e999a82ffb795925381415';
const tokenId = 1;

//调用方法
getOwnerOfTokenID(address, tokenId).then((owner) => {
    console.log(`Owner of token ID ${tokenId}: ${owner}`);
}).catch((error) => {
    if (error.data && error.data.revert) {  
        console.log(`Token ID ${tokenId} does not exist: ${error.data.revert}`);  
    } else {  
        throw error;  
    }  
});      

//调用方法
getMetadataURIOfTokenID(address, tokenId).then((metadataURI) => {
    console.log(`Metadata URI for token ID ${tokenId}: ${metadataURI}`);
}).catch((error) => {
    if (error.data && error.data.revert) {  
        console.log(`Token ID ${tokenId} does not exist: ${error.data.revert}`);  
    } else {  
        throw error;  
    }  
});
