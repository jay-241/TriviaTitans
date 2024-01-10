const request = require('axios');

exports.handler = async (inputEvent) => {
    const identifiedIntent = inputEvent.interpretations[0].intent;
    const intentId = identifiedIntent.name;
    const slotSet = identifiedIntent.slots;
    const groupTag = slotSet.teamname;

    const dialogueInstructions = {};

    if (!groupTag) {
        dialogueInstructions.type = 'ElicitSlot';
        dialogueInstructions.slotToElicit = 'teamname';  
        dialogueInstructions.intentName = intentId;
        dialogueInstructions.slots = slotSet;
    } else {
        dialogueInstructions.type = 'Close';
    }

    const intentReply = {
        name: intentId
    };

    if (!groupTag) {
        intentReply.confirmationState = 'None';
        intentReply.state = 'InProgress';
    } else {
        intentReply.confirmationState = 'Confirmed';
        intentReply.state = 'Fulfilled';
    }

    const messageArray = [];

    if (!groupTag) {
        messageArray.push({
            contentType: 'PlainText',
            content: 'We need the name of the team, please.'
        });
    } else {
        const groupTagValue = groupTag.value.originalValue;

        const apiResponse = await request.post("https://d6x5p3bllk.execute-api.us-east-1.amazonaws.com/prod/createtable", {
            teamname: groupTagValue
        });

        const teamData = apiResponse.data;

        if (!teamData) {
            messageArray.push({
                contentType: 'PlainText',
                content: `We couldn't find scores for the team.`
            });
        } else {
            var scoreMessage = `Points for team ${groupTagValue} are ${teamData.totalScore}.`;
            messageArray.push({
                contentType: 'PlainText',
                content: scoreMessage
            });
        }
    }

    return {
        sessionState: {
            dialogAction: dialogueInstructions,
            intent: intentReply
        },
        messages: messageArray
    };
};
