const databaseClient = require('./firebaseConnection')
const axios = require('axios');
exports.lambdaHandler = async (event, context) => {
    const gamesData = event;
    console.log(event);


    try {
        let estimatedTime;
        if(gamesData.difficulty === 'easy'){
            estimatedTime = gamesData.questions.length * 10;
        }
        if(gamesData.difficulty === 'medium'){
            estimatedTime = gamesData.questions.length *20;

        }
        if (gamesData.difficulty === 'hard'){
            estimatedTime = gamesData.questions.length * 30;
        }
        const docRef = await databaseClient.collection('games').add({
            questions : gamesData.questions,
            difficulty : gamesData.difficulty,
            categoryId : gamesData.categoryId,
            startTime : gamesData.startTime,
            participants : gamesData.participants,
            duration :  estimatedTime
        })

        await axios.post("https://5vknd5nsqk.execute-api.us-east-1.amazonaws.com/Dev/sendnotification",{
            message: "A new game was created, Please login and try the quiz..."
        })
        return{

            "gamesId": docRef.id
        }

    } catch (error) {
        console.log(error);
        // Returning an error response if there is a server error
        return {
            message: "server error"
        }

    }


}