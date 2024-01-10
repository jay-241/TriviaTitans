const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' }); // Set your region

const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const requestBody = JSON.parse(event.body);
  const teamName = requestBody.teamName;
  const categoryName = requestBody.categoryName;
  const score = requestBody.score;

  let params = {
    TableName: 'Teams',
    Key: {
      'teamname': teamName,
    },
  };

  let result = await ddb.get(params).promise();
  let item = result.Item;

  if (!item.hasOwnProperty('categoryname')) {
    item['categoryname'] = {};
  }
  if (!item.hasOwnProperty('totalScore')) {
    item['totalScore'] = 0;
  }
  if (!item.hasOwnProperty('totalgamesplayed')) {
    item['totalgamesplayed'] = 0;
  }
  if (!item.hasOwnProperty('timeFrame')) {
    item['timeFrame'] = {
      'daily': 0,
      'weekly': 0,
      'monthly': 0
    };
  }
  if (!item['categoryname'].hasOwnProperty(categoryName)) {
    item['categoryname'][categoryName] = 0;
  }

  item['categoryname'][categoryName] += score;
  item['lastscore'] = score;
  item['totalScore'] += score;
  item['totalgamesplayed'] += 1;

  const now = new Date();
  const lastPlayed = new Date(item['lastgameplayed']);

  // Difference in days for weekly and monthly checks
  const diffDays = Math.abs(now - lastPlayed) / (1000 * 60 * 60 * 24); 

  if (diffDays > 7) {
    // If more than 7 days, update the weekly score
    item['timeFrame']['weekly'] = score;
  } else {
    // If less than 7 days, add the score to the weekly score
    item['timeFrame']['weekly'] += score;
  }

  if (diffDays > 30) {
    // If more than 30 days, update the monthly score
    item['timeFrame']['monthly'] = score;
  } else {
    // If less than 30 days, add the score to the monthly score
    item['timeFrame']['monthly'] += score;
  }

  // Difference in hours for daily check
  const diffHours = Math.abs(now - lastPlayed) / 36e5;

  if (diffHours > 24) {
    // If more than 24 hours, update the daily score
    item['timeFrame']['daily'] = score;
  } else {
    // If less than 24 hours, add the score to the daily score
    item['timeFrame']['daily'] += score;
  }

  item['lastgameplayed'] = now.toISOString();

  params = {
    TableName: 'Teams',
    Key: {
      'teamname': teamName,
    },
    UpdateExpression: `set categoryname = :c, lastscore = :l, totalScore = :t, totalgamesplayed = :g, lastgameplayed = :d, timeFrame = :f`,
    ExpressionAttributeValues: {
      ':c': item['categoryname'],
      ':l': item['lastscore'],
      ':t': item['totalScore'],
      ':g': item['totalgamesplayed'],
      ':d': item['lastgameplayed'],
      ':f': item['timeFrame']
    },
    ReturnValues: 'UPDATED_NEW',
  };

  result = await ddb.update(params).promise();

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Change this to your allowed origin
    },
    body: JSON.stringify('Item updated successfully!'),
  };
  return response;
};
