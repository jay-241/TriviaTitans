import boto3

dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    # Extract input parameters from the event
    emailID = event['emailID']
    teamname = event['teamname']
    status = event['status']
    
    team_name = teamname.replace("_", " ")

    # Validate input parameters
    if not emailID or not teamname:
        return {
            'statusCode': 400,
            'body': 'emailID and teamname are required parameters'
        }

    try:
        # If status is "confirm", update the members set in the DynamoDB table
        if status == 'confirm':
            update_team_table(emailID, team_name)
            
        
        if status == 'reject':
            return {
            'statusCode': 200,
            'body': 'Invite rejected'
        }

        # Create a new item in the User table
        response = create_user_item(emailID, team_name)

        return response

    except Exception as e:
        return {
            'statusCode': 500,
            'body': f'Failed to update the DynamoDB table: {str(e)}'
        }

def update_team_table(emailID, teamname):
    teamTable = dynamodb.Table('Team')

    # Get the current members set for the team
    response = teamTable.update_item(
        Key={
            'TeamName': teamname
        },
        UpdateExpression='ADD Members :email',
        ExpressionAttributeValues={
            ':email': set([emailID])
        }
    )

def create_user_item(emailID, teamname):
    userTable = dynamodb.Table('User')

    try:
        # Check if the item with the given emailID already exists in the table
        response = userTable.get_item(
            Key={
                'emailID': emailID,
            }
        )

        # If the item already exists, check if the teamname is already set
        if 'Item' in response:
            item = response['Item']
            existing_teamname = item.get('teamname')

            # if existing_teamname:
            #     return {
            #         'statusCode': 400,
            #         'body': 'User is already in a team'
            #     }

            # If the teamname is not set, update the item with the new teamname
            userTable.update_item(
                Key={
                    'emailID': emailID,
                },
                UpdateExpression='SET teamname = :teamname',
                ExpressionAttributeValues={
                    ':teamname': teamname,
                }
            )

        else:
            # If the item does not exist, create a new item in the User table
            userTable.put_item(
                Item={
                    'emailID': emailID,
                    'teamname': teamname
                }
            )

        return {
            'statusCode': 200,
            'body': 'Confirmed Successfully'
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': f'Failed to create the user item: {str(e)}'
        }

