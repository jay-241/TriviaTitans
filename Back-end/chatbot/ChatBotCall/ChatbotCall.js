const AWS_SDK = require('aws-sdk');
const lexService = new AWS_SDK.LexRuntimeV2({ region: 'us-east-1' });

exports.handler = async (payload) => {
    const requestData = payload.body ? JSON.parse(payload.body) : payload;
    const userMessage = requestData.message;
    const userIdentifier = requestData.userId;

    if (!userIdentifier || !userMessage) {
        return {
            statusCode: 400,
            body: JSON.stringify({ alert: 'Invalid data received' }),
        };
    }

    try {
        const lexInput = {
            botAliasId: 'TSTALIASID',
            botId: '5SVLQ9NRNX',
            localeId: 'en_US',
            sessionId: userIdentifier,
            text: userMessage,
        };

        const lexOutput = await lexService.recognizeText(lexInput).promise();
        const botResponse = lexOutput.messages[0].content;

        return {
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': '*', // Change this to your allowed origin
              "Access-Control-Allow-Headers" : "Content-Type",
              "Access-Control-Allow-Origin": "http://localhost:3000",
              "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: botResponse,
        };
    } catch (problem) {
        console.log(problem);
        return {
            statusCode: 500,
            body: JSON.stringify({ alert: 'Unexpected server issue' }),
        };
    }
};
