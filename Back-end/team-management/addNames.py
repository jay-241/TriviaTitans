import boto3

dynamodb = boto3.resource('dynamodb')
table_name = 'TeamNames'  # Replace with your DynamoDB table name

def lambda_handler(event, context):
    team_names = [
        "Powerful Panthers",
        "Dynamic Dragons",
        "Vibrant Vipers",
        "Mighty Mustangs",
        "Fierce Falcons",
        "Brave Bears",
        "Swift Sharks",
        "Courageous Cheetahs",
        "Adventurous Alligators",
        "Daring Dolphins",
        "Wise Wolves",
        "Spirited Stallions",
        "Stealthy Tigers",
        "Loyal Lions",
        "Energetic Elephants",
        "Resilient Rhinos",
        "Witty Warthogs",
        "Nimble Narwhals",
        "Clever Coyotes",
        "Playful Penguins",
        "Sneaky Snakes",
        "Gentle Giraffes",
        "Joyful Jaguars",
        "Heroic Hedgehogs",
        "Enthusiastic Eagles",
        "Whimsical Whales",
         "Trivia Titans",
        "Quiz Wizards",
        "Knowledge Masters",
        "Mindful Thinkers",
        "Intellectual All-Stars",
        "Genius Squad",
        "Curiosity Crew",
        "Enigma Elite",
        "Brainiac Brigade",
        "Savvy Scholars",
        "Cerebral Legends",
        "Thought Leaders",
        "Puzzle Pros",
        "Riddle Experts",
        "Smarty Pants",
        "Logic Geniuses",
        "Mental Magicians",
        "Whiz Kids",
        "Einstein's Army",
        "The Inquisitors",
        "The Enigmas",
        "The Sages",
        "The Brain Trust",
        "The Cognitive Crew",
        "The Trivia Masters"
    ]

    table = dynamodb.Table(table_name)

    for team_name in team_names:
        table.put_item(Item={'teamName': team_name})

    return {
        "statusCode": 200,
        "body": "Team names added to DynamoDB table."
    }
