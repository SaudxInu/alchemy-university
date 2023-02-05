import os
import sys
import time
import logging

import settings
import argparse
import schedule
import pandas as pd

from utils.balances import get_erc20_token_balances_usd
from utils.telegram import send_telegram_message


logging.basicConfig(level=logging.INFO)


def get_account_addresses():
    parser = argparse.ArgumentParser()

    parser.add_argument("--addresses", type=str, required=True)

    args = parser.parse_args()

    n = len(args.addresses)

    x = args.addresses[1 : n - 1]

    account_addresses = x.split(", ")

    return account_addresses


def main():
    account_addresses = get_account_addresses()

    for account_address in account_addresses:
        erc20_token_balances = []
        for evm_blockchain_name in ["ethereum", "polygon-pos", "arbitrum-one"]:
            df_erc20_token_balances = get_erc20_token_balances_usd(
                evm_blockchain_name, account_address
            )

            erc20_token_balances += df_erc20_token_balances.to_dict("records")
        df_erc20_token_balances = pd.DataFrame(erc20_token_balances)

        if not df_erc20_token_balances.empty:
            df_erc20_token_balances.sort_values(
                by=["token_balance_usd"], ascending=False, inplace=True
            )

            logging.info(df_erc20_token_balances.to_markdown(index=False))

            send_telegram_message(
                settings.TELEGRAM_BOT_TOKEN,
                settings.TELEGRAM_CHAT_ID,
                df_erc20_token_balances.to_markdown(index=False),
            )


schedule.every().day.at("00:00").do(main)


if __name__ == "__main__":
    try:
        while True:
            schedule.run_pending()

            time.sleep(60)
    except KeyboardInterrupt:
        logging.warning("Interrupted")
    except Exception as err:
        logging.error(err)
    finally:
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)
