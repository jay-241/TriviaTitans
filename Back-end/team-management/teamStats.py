import boto3

# Set the region for DynamoDB
dynamodb = boto3.resource('dynamodb')
table_name = 'Team'  # Replace 'Team' with the actual name of your DynamoDB table

def lambda_handler(event, context):
    try:
        # Get the team name from the event
        teamname = event['TeamName']
        
        teamname = teamname.replace('_', ' ')

        # Retrieve the team details from the DynamoDB table
        team_details = get_team_details(teamname)
        if not team_details:
            return {
                'statusCode': 404,
                'body': 'Team not found.'
            }

        # Extract the members and games data from the team_details
        members = list(team_details.get('Members', []))  # Convert set to list
        games_data = team_details.get('Games', {})
        num_games_played = len(games_data)
        total_score = sum(games_data.values())

        # Construct the response
        response_body = {
            'TeamName': teamname,
            'Members': members,
            'NumberOfGamesPlayed': num_games_played,
            'TotalScore': total_score
        }

        return {
            'statusCode': 200,
            'body': response_body
        }
    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': 'Internal server error.'
        }

def get_team_details(teamname):
    table = dynamodb.Table(table_name)
    response = table.get_item(Key={'TeamName': teamname})
    return response.get('Item')
