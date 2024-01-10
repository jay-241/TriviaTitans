const databaseClient = require('./firebaseConnection')
exports.lambdaHandler = async (event, context) => {
    const gamesData = event.gamesData;
    const gamesId = event.gamesId;
    try{
        let gameQuestions = await databaseClient.collection('games').doc(gamesId).get();
        const question = gameQuestions.data().questions;
        const arr = []
        for( let i in question){
            let que = await databaseClient.collection('Questions').doc(question[i]).get();
            let alldata = que.data();
            arr.push(alldata);
        }
        return{
           "results" : arr
    }
    }catch(error){
        console.log(error);
        // Returning an error response if there is a server error
        return {
            message: "internal server error" }
    }


}