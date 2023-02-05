import requests
import logging

import settings
import pandas as pd


ALCHEMY_BLOCKCHAIN_URLS = {
    "ethereum": settings.ALCHEMY_URL_ETHEREUM_MAINNET,
    "polygon-pos": settings.ALCHEMY_URL_POLYGON_MAINNET,
    "arbitrum-one": settings.ALCHEMY_URL_ARBITRUM_MAINNET,
}


def get_erc20_token_metadata(
    evm_blockchain_name: str, erc20_token_address: str
) -> dict:
    if evm_blockchain_name not in ALCHEMY_BLOCKCHAIN_URLS.keys():
        raise Exception(f"Blockchain network, {evm_blockchain_name} not supported.")

    payload = {
        "id": 1,
        "jsonrpc": "2.0",
        "method": "alchemy_getTokenMetadata",
        "params": [erc20_token_address],
    }
    headers = {"accept": "application/json", "content-type": "application/json"}

    response = requests.post(
        ALCHEMY_BLOCKCHAIN_URLS[evm_blockchain_name], json=payload, headers=headers
    ).json()

    raw_token_metadata = {}
    if "error" in response:
        logging.error(f"Failed to fetch token metadata. Response: {response}")

        logging.warning(
            f"Warning: This method will return default values for ERC20 token at address, {erc20_token_address} on blockchain, {evm_blockchain_name}."
        )
    else:
        raw_token_metadata = response["result"]

    token_metadata = {
        "blockchain": evm_blockchain_name,
        "erc20_token_contract_address": erc20_token_address,
    }

    if "decimals" not in raw_token_metadata:
        token_metadata["decimals"] = 18
    else:
        token_metadata["decimals"] = raw_token_metadata["decimals"]

    if "name" not in raw_token_metadata:
        token_metadata["name"] = ""
    else:
        token_metadata["name"] = raw_token_metadata["name"]

    if "symbol" not in raw_token_metadata:
        token_metadata["symbol"] = ""
    else:
        token_metadata["symbol"] = raw_token_metadata["symbol"]

    return token_metadata


def get_erc20_token_metadata_batch(
    evm_blockchain_name: str, erc20_token_addresses: list[str]
) -> pd.core.frame.DataFrame:
    if evm_blockchain_name not in ALCHEMY_BLOCKCHAIN_URLS.keys():
        raise Exception(f"Blockchain network, {evm_blockchain_name} not supported.")

    erc20_tokens_metadata = []
    for erc20_token_address in erc20_token_addresses:
        erc20_token_metadata = get_erc20_token_metadata(
            evm_blockchain_name, erc20_token_address
        )

        erc20_tokens_metadata.append(erc20_token_metadata)

    df_erc20_token_metadata = pd.DataFrame(erc20_tokens_metadata)

    return df_erc20_token_metadata


def get_erc20_token_balances_raw(
    evm_blockchain_name: str, address: str
) -> pd.core.frame.DataFrame:
    if evm_blockchain_name not in ALCHEMY_BLOCKCHAIN_URLS.keys():
        raise Exception(f"Blockchain network, {evm_blockchain_name} not supported.")

    payload = {
        "id": 1,
        "jsonrpc": "2.0",
        "method": "alchemy_getTokenBalances",
        "params": [address],
    }
    headers = {"accept": "application/json", "content-type": "application/json"}

    response = requests.post(
        ALCHEMY_BLOCKCHAIN_URLS[evm_blockchain_name], json=payload, headers=headers
    ).json()

    if "error" in response:
        raise Exception("Failed to fetch token balances.", response)

    df_erc20_token_balances_raw = pd.DataFrame(response["result"]["tokenBalances"])

    df_erc20_token_balances_raw.rename(
        columns={
            "contractAddress": "erc20_token_contract_address",
            "tokenBalance": "raw_token_balance",
        },
        inplace=True,
    )

    df_erc20_token_balances_raw["raw_token_balance"] = df_erc20_token_balances_raw[
        "raw_token_balance"
    ].apply(lambda x: int(x, 16))

    df_erc20_token_balances_raw["blockchain"] = evm_blockchain_name

    df_erc20_token_balances_raw["holder_address"] = address

    return df_erc20_token_balances_raw


def get_erc20_token_balances(
    evm_blockchain_name: str, address: str
) -> pd.core.frame.DataFrame:
    if evm_blockchain_name not in ALCHEMY_BLOCKCHAIN_URLS.keys():
        raise Exception(f"Blockchain network, {evm_blockchain_name} not supported.")

    df_erc20_token_balances_raw = get_erc20_token_balances_raw(
        evm_blockchain_name, address
    )

    df_erc20_tokens_metadata = get_erc20_token_metadata_batch(
        evm_blockchain_name,
        df_erc20_token_balances_raw["erc20_token_contract_address"].to_list(),
    )

    df_erc20_token_balances = df_erc20_token_balances_raw.merge(
        df_erc20_tokens_metadata, on="erc20_token_contract_address", how="left"
    )

    df_erc20_token_balances["token_balance"] = (
        df_erc20_token_balances["raw_token_balance"]
        / 10 ** df_erc20_token_balances["decimals"]
    )

    df_erc20_token_balances = df_erc20_token_balances[
        [
            "blockchain_x",
            "holder_address",
            "erc20_token_contract_address",
            "name",
            "symbol",
            "token_balance",
        ]
    ]

    df_erc20_token_balances.rename(columns={"blockchain_x": "blockchain"}, inplace=True)

    return df_erc20_token_balances
