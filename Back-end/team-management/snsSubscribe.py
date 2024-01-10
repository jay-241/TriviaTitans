import boto3
import json

def lambda_handler(event, context):
    try:
        email_id = event['emailID']
        sns_topic_arn = 'arn:aws:sns:us-east-1:831294309591:inviteTeam'  # Replace with your SNS topic ARN
        
        sns_client = boto3.client('sns')
        
        # Create the subscription with the filter policy
        response = sns_client.subscribe(
            TopicArn=sns_topic_arn,
            Protocol='email',
            Endpoint=email_id,
            Attributes={
                'FilterPolicy': json.dumps({
                    'emailID': [email_id],
                    'event': [
                        {
                            'anything-but': 'team_reject'
                        }
                    ]
                })
            }
        )
        
        subscription_arn = response['SubscriptionArn']
        
        return {
            'statusCode': 200,
            'body': {
                'message': 'Subscription created successfully',
                'subscriptionArn': subscription_arn
            }
        }
        
    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': {
                'error': 'Failed to create subscription'
            }
        }
