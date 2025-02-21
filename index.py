import os
from web3 import Web3
from dotenv import load_dotenv

load_dotenv()

# 获取 Infura 项目 ID
infura_project_id = os.getenv('INFURA_PROJECT_ID')

# 连接到以太坊主网节点
w3 = Web3(Web3.HTTPProvider(f'https://mainnet.infura.io/v3/{infura_project_id}'))

# 定义合约ABI
abi = [
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
]

# 定义合约地址和Token ID
address = '0x0483b0dfc6c78062b9e999a82ffb795925381415'
token_id = 1

# 将地址转换为检查和地址格式
checksum_address = Web3.to_checksum_address(address)

# 获取合约对象
contract = w3.eth.contract(address=checksum_address, abi=abi)

# 定义获取Owner的方法
def get_owner_of_token_id(token_id):
    try:
        owner = contract.functions.ownerOf(token_id).call()
        return owner
    except Exception as error:
        if hasattr(error, 'args') and 'revert' in error.args[0]:
            print(f"Token ID {token_id} does not exist: {error.args[0]}")
        else:
            raise error

# 定义获取Metadata URI的方法
def get_metadata_uri_of_token_id(token_id):
    try:
        metadata_uri = contract.functions.tokenURI(token_id).call()
        return metadata_uri
    except Exception as error:
        if hasattr(error, 'args') and 'revert' in error.args[0]:
            print(f"Token ID {token_id} does not exist: {error.args[0]}")
        else:
            raise error

# 调用方法
owner = get_owner_of_token_id(token_id)
if owner:
    print(f"Owner of token ID {token_id}: {owner}")

metadata_uri = get_metadata_uri_of_token_id(token_id)
if metadata_uri:
    print(f"Metadata URI for token ID {token_id}: {metadata_uri}")