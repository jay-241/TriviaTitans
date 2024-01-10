import boto3

dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    # Extract team name from the event
    teamname = event['teamname']

    team_name = teamname.replace("_", " ")
    
    try:
        # Get the team details from the DynamoDB table
        team_table = dynamodb.Table('Team')
        response = team_table.get_item(
            Key={
                'TeamName': team_name
            }
        )
        
        item = response.get('Item')
        
        if not item:
            return {
                'statusCode': 404,
                'body': 'Team not found'
            }
        
        # Extract admin and members from the DynamoDB item
        admin = item['Admin']
        members = item.get('Members', [])  # members is a string set, return an empty list if not present
        
        return {
            'statusCode': 200,
            'body': {
                'admin': admin,
                'members': list(members)  # Convert the members set to a list for JSON serialization
            }
        }
        
        # return {
        #     'admin': admin,
        #     'members': list(members)  # Convert the members set to a list for JSON serialization
        #     }
        

    except Exception as e:
        return {
            'statusCode': 500,
            'body': f'Failed to retrieve team details: {str(e)}'
        }
