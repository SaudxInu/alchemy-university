import pandas as pd
from pycoingecko import CoinGeckoAPI


COIN_GECKO_ASSET_PLATFORM_IDS = [
    "ethereum",
    "polygon-pos",
    "arbitrum-one",
]


def get_erc20_token_price_usd(
    evm_blockchain_name: str, erc20_contract_addresses: list[str]
) -> pd.core.frame.DataFrame:
    if evm_blockchain_name not in COIN_GECKO_ASSET_PLATFORM_IDS:
        raise Exception(f"Blockchain network, {evm_blockchain_name} not supported.")

    contract_addresses = ""
    for contract_address in erc20_contract_addresses:
        contract_addresses = contract_addresses + contract_address + ","
    contract_addresses = contract_addresses[:-1]

    cg = CoinGeckoAPI()

    response = cg.get_token_price(evm_blockchain_name, contract_addresses, "usd")

    erc20_tokens_price_usd = []
    for contract_address, price in response.items():
        erc20_tokens_price_usd.append(
            {
                "erc20_token_contract_address": contract_address,
                "price_usd": price["usd"],
            }
        )

    df_erc20_tokens_price_usd = pd.DataFrame(
        erc20_tokens_price_usd, columns=["erc20_token_contract_address", "price_usd"]
    )

    return df_erc20_tokens_price_usd
