import json
import boto3

# Set the region for DynamoDB
dynamodb = boto3.resource('dynamodb')
table_name = 'User'  # Replace 'User' with the actual name of your DynamoDB table

def lambda_handler(event, context):
    try:
        # Get the emailID from the event
        emailID = event['emailID']

        # Get the teamname from DynamoDB
        teamname = get_teamname_by_email(emailID)

        if not teamname:
            return {
                'statusCode': 404,
                'body':'Join or Create a Team'
            }

        return {
            'statusCode': 200,
            'body': teamname
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': 'Internal server error.'
        }

def get_teamname_by_email(emailID):
    table = dynamodb.Table(table_name)
    response = table.get_item(Key={'emailID': emailID})
    item = response.get('Item')
    if item:
        return item.get('teamname')
    else:
        return None
