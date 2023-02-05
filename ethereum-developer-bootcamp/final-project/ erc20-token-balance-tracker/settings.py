# Setup.
# Imports.
import os

from dotenv import load_dotenv


# Load environment variables.
load_dotenv()


# Main.
# Environment variables.
ALCHEMY_URL_ETHEREUM_MAINNET = os.environ.get("ALCHEMY_URL_ETHEREUM_MAINNET")
ALCHEMY_URL_POLYGON_MAINNET = os.environ.get("ALCHEMY_URL_POLYGON_MAINNET")
ALCHEMY_URL_ARBITRUM_MAINNET = os.environ.get("ALCHEMY_URL_ARBITRUM_MAINNET")
TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.environ.get("TELEGRAM_CHAT_ID")
