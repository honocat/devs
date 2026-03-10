from journal.questions import QUESTIONS
from journal.notion_client import save_to_notion


def ask_questions():
    answers = {}

    print("\n==============================")
    print("Identity & Vision Driver")
    print("==============================")

    for q in QUESTIONS:
        print("\n" + q["question"])
        answer = input("> ")

        answers[q["key"]] = answer

    return answers


def confirm_save():
    while True:
        ans = input("\nNotionに保存しますか？ (y/n): ").lower()

        if ans == "y":
            return True

        if ans == "n":
            return False


def main():
    answers = ask_questions()

    if confirm_save():
        save_to_notion(answers)

        print("\n✅ Notionに保存しました")

    else:
        print("\n保存をキャンセルしました")
