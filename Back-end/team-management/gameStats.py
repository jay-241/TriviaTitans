import boto3

# Set the region for DynamoDB
dynamodb = boto3.resource('dynamodb') 
table_name = 'Team'  # Replace 'Team' with the actual name of your DynamoDB table

def lambda_handler(event, context):
    try:
        # Get the game ID from the event
        gameID = event['gameID']

        # Query the DynamoDB table for teams that have the given gameID
        teams = query_teams_by_gameID(gameID)

        # Format the response with team name, members, and score of the game
        response = []
        for team in teams:
            team_name = team['TeamName']
            members = list(team['Members'])  # Convert the set to a list
            score = team['Games'].get(gameID, None)
            response.append({
                'TeamName': team_name,
                'Members': members,
                'Score': score
            })

        return {
            'statusCode': 200,
            'body': response
        }
    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': 'Internal server error.'
        }

def query_teams_by_gameID(gameID):
    table = dynamodb.Table(table_name)
    response = table.scan(
        FilterExpression='attribute_exists(Games.#gameID)',
        ExpressionAttributeNames={
            '#gameID': gameID
        }
    )
    return response['Items']
