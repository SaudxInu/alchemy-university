import pandas as pd

from .coin_gecko import get_erc20_token_price_usd
from .alchemy_token_api import get_erc20_token_balances


def get_erc20_token_balances_usd(
    evm_blockchain_name: str, address: str
) -> pd.core.frame.DataFrame:
    df_erc20_token_balances = get_erc20_token_balances(evm_blockchain_name, address)

    df_erc20_token_balances = df_erc20_token_balances[
        df_erc20_token_balances["token_balance"] != 0
    ]

    df_erc20_tokens_price_usd = get_erc20_token_price_usd(
        evm_blockchain_name,
        df_erc20_token_balances["erc20_token_contract_address"].to_list(),
    )

    df_erc20_token_balances_usd = df_erc20_token_balances.merge(
        df_erc20_tokens_price_usd, on="erc20_token_contract_address", how="left"
    )

    df_erc20_token_balances_usd["token_balance_usd"] = (
        df_erc20_token_balances_usd["token_balance"]
        * df_erc20_token_balances_usd["price_usd"]
    )

    return df_erc20_token_balances_usd
