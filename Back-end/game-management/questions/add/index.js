const databaseClient = require('./firebaseConnection')
const axios = require('axios');

exports.lambdaHandler = async (event, context) => {
    const questionsData = event;
    try{

        const tagQuestionAPIURL = 'https://gceak8vzy1.execute-api.us-east-1.amazonaws.com/dev/tags';
        const tagResponse = await axios.post(tagQuestionAPIURL, { subject: questionsData.subject });
        const tags = tagResponse.data.tags;

        const questionsRef = await databaseClient.collection('Questions').add({
            subject : questionsData.subject,
            options : questionsData.options,
            difficulty : questionsData.difficulty,
            categories : questionsData.categories,
            correctAns : questionsData.correctAns,
            tags: tags
        })

        return {
            "QuestionsId": questionsRef.id
        }
    }catch(error){
        console.log(error);
        // Returning an error response if there is a server error
        return{
            message: "internal server error"
        }
    }
}