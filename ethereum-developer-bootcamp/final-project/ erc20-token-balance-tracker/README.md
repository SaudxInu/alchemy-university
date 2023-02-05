# ERC20 Token Balance Tracker

## Data Sources

1. Alchemy Token API
2. CoinGecko

## Prerequisites

1. Python 3.10
2. Alchemy Account
3. Telegram Account
4. Docker (Optional)

## Setup

1. Create apps on alchemy for ethereum, polygon and arbitrum networks (mainnet).
2. Create a telegram bot.
3. Fill the `.env` file.

## Run

### Shell

1. Create a virtual environment and activate it.
2. Run `pip install -r requirements.txt`.
3. If you want to run the app once run `python erc20_token_balances.py --addresses "[address_1, address_2, address_3]"`.
   Else if you want it to run once every day run `python erc20_token_balances_schedule.py --addresses "[address_1, address_2, address_3]"`.

   Examples:

   `python erc20_token_balances.py --addresses "[0xc88A7076DF59D9410B6c5BD8dcDaFeAF1D250666, 0xDba7a7C1EB1266A4B3EBca476040170A3E7a3B81, 0x1bc996F1A9af4F7b90e703D8e0c13995442d13EF]"`

   `python erc20_token_balances_schedule.py --addresses "[0xc88A7076DF59D9410B6c5BD8dcDaFeAF1D250666, 0xDba7a7C1EB1266A4B3EBca476040170A3E7a3B81, 0x1bc996F1A9af4F7b90e703D8e0c13995442d13EF]"`

### Docker

1. Run `docker compose start`.
2. If you want to run the app once run `docker compose run erc20-token-balance-tracker python erc20_token_balances.py --addresses "[address_1, address_2, address_3]"`.
   Else if you want it to run once every day run `docker compose run erc20-token-balance-tracker python erc20_token_balances_schedule.py --addresses "[address_1, address_2, address_3]"`.

   Examples:

   `docker compose run erc20-token-balance-tracker python erc20_token_balances.py --addresses "[0xc88A7076DF59D9410B6c5BD8dcDaFeAF1D250666, 0xDba7a7C1EB1266A4B3EBca476040170A3E7a3B81, 0x1bc996F1A9af4F7b90e703D8e0c13995442d13EF]"`

   `docker compose run erc20-token-balance-tracker python erc20_token_balances_schedule.py --addresses "[0xc88A7076DF59D9410B6c5BD8dcDaFeAF1D250666, 0xDba7a7C1EB1266A4B3EBca476040170A3E7a3B81, 0x1bc996F1A9af4F7b90e703D8e0c13995442d13EF]"`
