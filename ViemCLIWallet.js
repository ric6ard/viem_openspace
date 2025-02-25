import { createPublicClient, createWalletClient, http, parseEther, parseGwei, encodeFunctionData} from 'viem';  
import { mainnet, sepolia } from 'viem/chains';  
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { ERC20Abi } from './ERC20abi.js';
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

// 构建交易数据
const functionData = encodeFunctionData({
  abi: ERC20Abi,
  functionName: "transfer",
  args: ["0x36912eb785f5a358fc0ea9cd0fb87041907b59c5", parseEther("8")]
});
const nonce = await publicClient.getTransactionCount({address: account.address})
const currentGasPrice = await publicClient.getGasPrice(); // 获取当前 Gas 价格
const maxFeePerGas = currentGasPrice + parseGwei("5"); // maxFeePerGas 设置为当前 gas + 5 Gwei
const maxPriorityFeePerGas = parseGwei("2"); // 设置适中的 maxPriorityFeePerGas

const request = await walletClient.prepareTransactionRequest({
    from: account.address,
    to: '0xa4cD0246Bc7A90532ccEc84F2A2F6df1B59e052d',
    // value: parseEther('0.001'),
    data: functionData,
    type: 'eip1559',
    nonce: nonce,
    maxFeePerGas: maxFeePerGas,
    maxPriorityFeePerGas: maxPriorityFeePerGas
  })

// const gasEstimate = await publicClient.estimateGas(request)
// request.gas = gasEstimate

// 签名交易
const serializedTransaction = await walletClient.signTransaction(request)

// 发送交易
const hash = await walletClient.sendRawTransaction({ serializedTransaction })
console.log(`Transaction: https://sepolia.etherscan.io/tx/${hash}`)

// 等待交易
const transaction = await publicClient.waitForTransactionReceipt( {hash: hash })
console.log('Transaction Status:', transaction.status)

// 监听交易
// const unwatch = publicClient.watchPendingTransactions( 
//     { onTransactions: hash => console.log(hash)})
