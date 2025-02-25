const inputData = '0xa9059cbb00000000000000000000000036912eb785f5a358fc0ea9cd0fb87041907b59c500000000000000000000000000000000000000000000021e0c0013070adc0000';
  
import { encodeFunctionData, parseEther } from 'viem';
import { ERC20Abi } from './ERC20abi.js';

const data = encodeFunctionData({
    abi: ERC20Abi,
    functionName: "transfer",
    args: ["0x36912eb785f5a358fc0ea9cd0fb87041907b59c5", parseEther("9999")]
  });
  
console.log(data);
console.log(inputData);
