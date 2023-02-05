import requests


def send_telegram_message(
    bot_token: str, chat_id: str, message: str, parse_mode: str = "HTML"
) -> None:
    req = (
        "https://api.telegram.org/bot"
        + bot_token
        + "/sendMessage?"
        + "chat_id="
        + chat_id
        + "&parse_mode="
        + parse_mode
        + "&text="
        + message
    )

    requests.get(req)
