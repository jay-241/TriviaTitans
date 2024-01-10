const databaseClient = require('./firebaseConnection')
exports.lambdaHandler = async (event, context) => {
    const questionsId = event.questionsId;
    const updateQuestion = event.updateQuestion;
    await databaseClient.collection('Questions').doc(questionsId).update(updateQuestion)

    return ({
        "message" : "success"
    });
}