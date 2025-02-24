import { createPublicClient, createWalletClient, http, parseEther, parseGwei} from 'viem';  
import { mainnet, sepolia } from 'viem/chains';  
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import 'dotenv/config';

const publicClient = createPublicClient({ chain: sepolia, transport: http(`https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`) });  

// 生成私钥
//const privateKey = generatePrivateKey()  //用生成的私钥
const privateKey = process.env.PRIVATE_KEY //用自备的私钥

const account = privateKeyToAccount(privateKey)
console.log(`Account: ${account.address}`)

const walletClient = createWalletClient({account: account, chain: sepolia, transport: http(`https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`) });

// 查询余额
const balance = await publicClient.getBalance({
    address: account.address,
    blockTag: 'safe'
  })
console.log(`Balance: ${balance}`)   

// 查询nonce
const nonce = await publicClient.getTransactionCount({
    address: account.address
  })
console.log('Nonce:', nonce)

// 构建交易
const request = await walletClient.prepareTransactionRequest({
    from: account.address,
    to: '0x36912Eb785f5A358Fc0EA9Cd0FB87041907B59c5',
    data: '0x',
    maxFeePerGas: parseGwei('100'),
    maxPriorityFeePerGas: parseGwei('5'),
    nonce: nonce,
    type: 'eip1559',
    value: parseEther('0.001')
  })


// 签名交易
const serializedTransaction = await walletClient.signTransaction(request)

// 发送交易
const hash = await walletClient.sendRawTransaction({ serializedTransaction })
console.log(`Transaction hash: ${hash}`)

// // 等待交易
// const transaction = await publicClient.waitForTransactionReceipt( {hash: hash })
// console.log('Transaction:', transaction)

// 监听交易
// const unwatch = publicClient.watchPendingTransactions( 
//     { onTransactions: hash => console.log(hash)})
