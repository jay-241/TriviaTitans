// export const handler = async (event) => {
//   // TODO implement
//   const response = {
//     statusCode: 200,
//     body: JSON.stringify('Hello from Lambda!'),
//   };
//   return response;
// };

const AWS = require('aws-sdk');

exports.handler = async (event) => {
  try {
    const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

    const params = {
      UserPoolId: 'us-east-1_MsHyhUYSr', // Replace with your User Pool ID
      AttributesToGet: ['name', 'email'], // Specify the attributes you want to fetch
      Limit: 60 // Maximum number of users to fetch in a single call
    };

    const allUsers = [];

    async function listUsersRecursive(params) {
      const data = await cognitoIdentityServiceProvider.listUsers(params).promise();

      const users = data.Users.map(user => {
        const attributes = {};
        user.Attributes.forEach(attr => {
          attributes[attr.Name] = attr.Value;
        });
        return attributes;
      });

      allUsers.push(...users);

      if (data.PaginationToken) {
        params.PaginationToken = data.PaginationToken;
        await listUsersRecursive(params);
      }

      return allUsers;
    }

    const users = await listUsersRecursive(params);

    return {
      statusCode: 200,
      body: JSON.stringify(users),
      headers: {
            "Access-Control-Allow-Origin": "*", // Adjust this to allow specific origins
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Content-Type": "application/json", // Add Content-Type header
      },
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred while fetching user data' }),
      headers: {
            "Access-Control-Allow-Origin": "*", // Adjust this to allow specific origins
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Content-Type": "application/json", // Add Content-Type header
        },
    };
  }
};
