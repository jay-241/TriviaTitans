import boto3

dynamodb = boto3.resource('dynamodb')
sns = boto3.client('sns')

def lambda_handler(event, context):
    recipients = event['recipients']
    real_team_name = event['team_name']
    admin = event['admin']
    
    team_name = real_team_name.replace(' ', '_')


    # Replace with your actual SNS topic ARN
    topic_arn = 'arn:aws:sns:us-east-1:831294309591:inviteTeam'

    create_team(real_team_name, admin)

    for email in recipients:
        # Construct the message body for each recipient
        message_body = f"Hey {email}, \nYou have been invited to join Team: {real_team_name}"
        message_body += f"\nAccept Invitation: https://wlfhjj5a5a.execute-api.us-east-1.amazonaws.com/game/invite?emailID={email}&teamname={team_name}&status=confirm"
        message_body += f"\nReject Invitation: https://wlfhjj5a5a.execute-api.us-east-1.amazonaws.com/game/invite?emailID={email}&teamname={team_name}&status=reject"

        # Publish the message to the SNS topic with the recipient's email ID as the message attribute
        response = sns.publish(
            TopicArn=topic_arn,
            Message=message_body,
            Subject=real_team_name,  # Replace with your desired subject
            MessageAttributes={
                'emailID': {
                    'DataType': 'String',
                    'StringValue': email
                },
                'event':{
                    'DataType':'String',
                    'StringValue':'team_invite'
                }
            }
        )

    return {
        'statusCode': 200,
        'body': 'Messages published successfully'
    }

def create_team(real_team_name, admin):
    table=dynamodb.Table('Team')
    table.put_item(
        Item={
            'TeamName': real_team_name,
            'Admin': admin,
            'Members': set([admin])  # Store the members as a set in DynamoDB
        }
    )

    # Update the 'TeamName' attribute in the 'User' table for the admin
    user_table = dynamodb.Table('User')
    user_table.update_item(
        Key={'emailID': admin},
        UpdateExpression='SET teamname = :real_team_name',
        ExpressionAttributeValues={
            ':real_team_name': real_team_name,
        }
    )