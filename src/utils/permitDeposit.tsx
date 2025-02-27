import { createPublicClient, http, type Address, type PublicClient } from 'viem';
import { mainnet } from 'viem/chains';
import { useAccount, useSigner } from 'wagmi';

const client: PublicClient = createPublicClient({ chain: mainnet, transport: http() });

export async function permitDeposit(tokenAddress: Address, owner: Address, spender: Address, value: bigint, deadline: bigint) {
  const { data: signer } = useSigner();
  const { address } = useAccount();

  if (!signer || !address) {
    throw new Error('Wallet not connected');
  }

  const tokenContract = {
    address: tokenAddress,
    abi: [
      'function nonces(address owner) view returns (uint256)',
      'function DOMAIN_SEPARATOR() view returns (bytes32)',
      'function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)'
    ]
  };

  const nonce = await client.readContract({
    address: tokenAddress,
    abi: tokenContract.abi,
    functionName: 'nonces',
    args: [owner]
  });

  const domainSeparator = await client.readContract({
    address: tokenAddress,
    abi: tokenContract.abi,
    functionName: 'DOMAIN_SEPARATOR'
  });

  const permitData = {
    owner,
    spender,
    value,
    nonce,
    deadline
  };

  const domain = {
    name: await client.readContract({
      address: tokenAddress,
      abi: tokenContract.abi,
      functionName: 'name'
    }),
    version: '1',
    chainId: await signer.getChainId(),
    verifyingContract: tokenAddress
  };

  const types = {
    Permit: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' }
    ]
  };

  const signature = await signer.signTypedData({ domain, types, value: permitData });
  const { v, r, s } = client.utils.splitSignature(signature);

  await client.writeContract({
    address: tokenAddress,
    abi: tokenContract.abi,
    functionName: 'permit',
    args: [owner, spender, value, deadline, v, r, s]
  });
}
