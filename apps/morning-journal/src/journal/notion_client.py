import os
from datetime import datetime
from notion_client import Client
from dotenv import load_dotenv

load_dotenv()

notion = Client(auth=os.getenv("NOTION_TOKEN"))
DATA_SOURCE_ID = os.getenv("DATA_SOURCE_ID")


def build_blocks(data):
    blocks = []

    sections = [
        ("あなたが人生をかけて成し遂げたいことは何ですか？", data["life_vision"]),
        ("そのために、この1年で到達すべき地点はどこですか？", data["year_goal"]),
        ("直近3ヶ月で、どの成果に集中しますか？", data["quarter_focus"]),
        (
            "あなたが最も避けたい『なりたくない自分』は、今日どのような行動をしていますか？",
            data["anti_vision"],
        ),
        (
            "理想の自分なら、今日どのような振る舞いを選択しますか？",
            data["ideal_identity"],
        ),
        (
            "今日、あなたの集中を奪うものは何ですか？それに対してどう対処しますか？",
            data["distraction_plan"],
        ),
        ("今日これだけは確実に実行する『最小の行動』は何ですか？", data["small_win"]),
    ]

    for title, content in sections:
        blocks.append(
            {
                "object": "block",
                "type": "heading_3",
                "heading_3": {
                    "rich_text": [{"type": "text", "text": {"content": title}}]
                },
            }
        )

        blocks.append(
            {
                "object": "block",
                "type": "paragraph",
                "paragraph": {
                    "rich_text": [{"type": "text", "text": {"content": content}}]
                },
            }
        )

    return blocks


def save_to_notion(data):
    today = datetime.now().strftime("%Y-%m-%d")

    notion.pages.create(
        parent={"database_id": DATA_SOURCE_ID},
        properties={
            "名前": {"title": [{"text": {"content": f"{today} モーニングジャーナル"}}]},
            "タグ": {"multi_select": [{"name": "ジャーナル"}]},
            "作成日時": {"date": {"start": today}},
        },
        children=build_blocks(data),
    )
