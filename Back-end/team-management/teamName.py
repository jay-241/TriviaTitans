import boto3

dynamodb = boto3.resource('dynamodb')
table_name = 'TeamNames'  # Replace with your DynamoDB table name

def lambda_handler(event, context):
    table = dynamodb.Table(table_name)

    # Retrieve a random team name from the DynamoDB table
    response = table.scan()
    team_names = response.get('Items', [])
    if not team_names:
        return {
            "statusCode": 404,
            "body": "No team names available."
        }

    team_name = team_names[0]['teamName']

    # Delete the retrieved team name from the DynamoDB table
    table.delete_item(Key={'teamName': team_name})

    return {
        "statusCode": 200,
        "body": team_name
    }
