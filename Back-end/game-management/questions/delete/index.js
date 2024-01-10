const databaseClient = require('./firebaseConnection')
exports.lambdaHandler = async (event, context) => {
    const questionsId = event.questionsId;
    await databaseClient.collection('Questions').doc(questionsId).delete()

    return ({
        "message" : "success"
    });
}