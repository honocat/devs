import os
from datetime import datetime
from notion_client import Client
from dotenv import load_dotenv

load_dotenv()

notion = Client(auth=os.getenv("NOTION_TOKEN"))
DATA_SOURCE_ID = os.getenv("NOTION_SOURCE_ID")


def save_to_notion(data):
    notion.pages.create(
        parent={"type": "data_source_id", "data_source_id": DATA_SOURCE_ID},
        properties={
            "Date": {"date": {"start": datetime.now().isoformat()}},
            "Life Vision": {"rich_text": [{"text": {"content": data["life_vision"]}}]},
            "Year Goal": {"rich_text": [{"text": {"content": data["year_goal"]}}]},
            "Quarter Focus": {
                "rich_text": [{"text": {"content": data["quarter_focus"]}}]
            },
            "Anti Vision": {"rich_text": [{"text": {"content": data["anti_vision"]}}]},
            "Ideal Identity": {
                "rich_text": [{"text": {"content": data["ideal_identity"]}}]
            },
            "Distraction Plan": {
                "rich_text": [{"text": {"content": data["distraction_plan"]}}]
            },
            "Small Win": {"rich_text": [{"text": {"content": data["small_win"]}}]},
        },
    )
