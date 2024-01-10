const databaseClient = require('./firebaseConnection')
exports.lambdaHandler = async (event, context) => {
    const gamesId = event.gamesId;

    try{
        const gamesRef = await databaseClient.collection('games').doc(gamesId).delete()

        return {
            "message" : "success"
        }
    }catch(error){
        console.log(error);
        // Returning an error response if there is a server error
        return {
            message: "internal server error"
        }
    }

}