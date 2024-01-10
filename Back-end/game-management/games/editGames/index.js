const databaseClient = require('./firebaseConnection')
exports.lambdaHandler = async (event, context) => {
    const gamesData = event.gamesData;
    const gamesId = event.gamesId;
    console.log(gamesData);
    try{
        const gamesRef = await databaseClient.collection('games').doc(gamesId).update(gamesData)

        return{
            "message" : "success"
        }
    }catch(error){
        console.log(error);
        // Returning an error response if there is a server error
        return
        {
            message: "internal server error"
        }
    }

}