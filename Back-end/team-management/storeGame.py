import boto3

# Set the region for DynamoDB
dynamodb = boto3.resource('dynamodb')
table_name = 'Team'  # Replace 'Team' with the actual name of your DynamoDB table
table = dynamodb.Table(table_name)  # Create a reference to the DynamoDB table

def lambda_handler(event, context):
    try:
        # Get the team name, game ID, and score from the event
        teamname = event['teamname']
        gameID = event['gameID']
        score = int(event['score'])  # Convert score to an integer

        # Check if the team name exists in the DynamoDB table
        team_details = get_team_details(teamname)
        if not team_details:
            return {
                'statusCode': 404,
                'body': 'Team not found.'
            }

        # Update the game ID and score in the DynamoDB table
        update_games(teamname, gameID, score)

        return {
            'statusCode': 200,
            'body': 'Game score updated successfully.'
        }
    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': 'Internal server error.'
        }

def get_team_details(teamname):
    response = table.get_item(Key={'TeamName': teamname})
    return response.get('Item')

def update_games(teamname, gameID, score):
    # Check if the 'Games' attribute already exists in the item
    team_details = get_team_details(teamname)
    if 'Games' in team_details:
        # Update the 'Games' attribute by adding the new game ID and score
        response = table.update_item(
            Key={'TeamName': teamname},
            UpdateExpression='SET #games.#gameID = :scoreValue',
            ExpressionAttributeNames={
                '#games': 'Games',
                '#gameID': gameID
            },
            ExpressionAttributeValues={
                ':scoreValue': score
            },
            ConditionExpression='attribute_not_exists(#games.#gameID)',
            ReturnValues='NONE'
        )
    else:
        # Create the 'Games' attribute with the new game ID and score
        response = table.update_item(
            Key={'TeamName': teamname},
            UpdateExpression='SET #games = :gamesValue',
            ExpressionAttributeNames={
                '#games': 'Games'
            },
            ExpressionAttributeValues={
                ':gamesValue': {gameID: score}
            },
            ReturnValues='NONE'
        )
    
    return response
