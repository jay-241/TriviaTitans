const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const defaultCategories = {
  "fitness": 0,
  "cloud": 0,
  "sports": 0,
  "dance": 0,
  "music": 0,
  "computerScience": 0
};

exports.handler = async (event, context) => {
  // Parse the body content from string to a JavaScript object
  const requestBody = JSON.parse(event.body);
  
  const { teamname, categoryname, lastscore, totalScore, totalgamesplayed, lastgameplayed } = requestBody;

  try {
    // Check if the teamname already exists in the DynamoDB table
    const existingTeam = await getTeamByName(teamname);

    if (existingTeam) {
      // If the team exists, do nothing and return the existing team
      return {
        statusCode: 200,
        body: JSON.stringify(existingTeam),
      };
    } else {
      // If the team does not exist, create a new item with default values
      const newTeam = await createTeam(teamname, defaultCategories, lastscore, totalScore, totalgamesplayed, lastgameplayed);
      return {
        statusCode: 201,
        body: JSON.stringify(newTeam),
      };
    }    
  } catch (error) {
    console.log(error);  // Add this line to log the error for more detailed troubleshooting
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Something went wrong.' }),
    };
  }
};

// Function to get a team by teamname from DynamoDB
const getTeamByName = async (teamname) => {
  const params = {
    TableName: 'Teams',
    Key: {
      teamname: teamname,
    },
  };

  const result = await dynamoDB.get(params).promise();
  return result.Item;
};

// Function to create a new team in DynamoDB
const createTeam = async (teamname, categories, lastscore, totalScore, totalgamesplayed, lastgameplayed) => {
  const params = {
    TableName: 'Teams',
    Item: {
      teamname: teamname,
      categoryname: categories,
      lastscore: 0,
      totalScore: 0,
      totalgamesplayed: 0,
      lastgameplayed: new Date().toISOString(),
      timeFrame: {
        daily: 0,
        monthly: 0,
        weekly: 0,
      }
    },
    ConditionExpression: 'attribute_not_exists(teamname)',
  };

  await dynamoDB.put(params).promise();
  return params.Item;
};
