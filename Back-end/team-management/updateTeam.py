import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Team')
user_table = dynamodb.Table('User')  # Add the 'User' table

def lambda_handler(event, context):
    try:
        team_name = event['teamname']
        admin = event.get('admin')
        delete_member = event.get('deleteMember')  # Check if 'deleteMember' is present in the event
        
        response = table.get_item(
            Key={
                'TeamName': team_name
            }
        )
        if 'Item' not in response:
            return {
                'statusCode': 404,
                'body': {'error': 'Team not found.'}
            }

        # Update Admin
        if admin:
            table.update_item(
                Key={'TeamName': team_name},
                UpdateExpression='SET #adm = :adminValue',
                ExpressionAttributeNames={
                    '#adm': 'Admin'
                },
                ExpressionAttributeValues={
                    ':adminValue': admin
                }
            )

        # Update Member
        if delete_member:
            table.update_item(
                Key={'TeamName': team_name},
                UpdateExpression='DELETE Members :member',
                ExpressionAttributeValues={':member': {delete_member}}
            )

            user_table.update_item(
                Key={'emailID': delete_member},
                UpdateExpression='REMOVE teamname'
            )
        
        return {
            'statusCode': 200,
            'body': 'Team Updated'
        }

    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': {'error': 'Failed to update the item.'}
        }
