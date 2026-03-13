# front.py
import os
import json
import boto3

backLambda = boto3.client("lambda")

def lambda_handler(event, context):
    body = json.loads(event["body"])
    print(f"Received body: {body}")

    if "challenge" in body:
        return {
            "statusCode": 200,
            "body": json.dumps({"challenge": body["challenge"]})
        }

    event_type = body["event"]["type"]

    if event_type == "app_mention":
        text = body["event"]["text"]

        message_body = {
            "channel": body["event"]["channel"],
            "user": body["event"]["user"],
            "thread_ts": body["event"]["ts"],
            "text": text
        }

        print(f"Prepared message body: {message_body}")

        try:
            response = backLambda.invoke(
                FunctionName = "create-sheet-back",
                InvocationType = "Event",
                Payload = json.dumps(message_body)
            )
            print(f"Message sent to back lambda function successfully. RequestId: {response["ResponseMetadata"]["RequestId"]}")
        except Exception as e:
            print(f"Error sending message to back lambda function: {str(e)}")
            return {
                "statusCode": 500,
                "body": json.dumps("Error sending message to back lambda function")
            }

    return {
        "statusCode": 200,
        "body": json.dumps("Event received and sent to back lambda function")
    }
