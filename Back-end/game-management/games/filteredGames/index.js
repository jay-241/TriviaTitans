const databaseClient = require('./firebaseConnection')
exports.lambdaHandler = async (event, context) => {
    const gamesData = event;
    try{
        let filteredgames = await databaseClient.collection('games');


        if(gamesData.categoryId){
            filteredgames = filteredgames.where('categoryId', '==', gamesData.categoryId);
        }
        if(gamesData.difficulty){
            filteredgames = filteredgames.where('difficulty', '==', gamesData.difficulty);
        }
        if(gamesData.startTime){
            filteredgames = filteredgames.where('startTime', '>=', gamesData.startTime);
        }
        if(gamesData.duration){
            filteredgames = filteredgames.where('duration', '==', gamesData.duration);
        }
        const documents = await filteredgames.get();
        const arr = [];
        for(let doc of documents.docs){
            const gameData = doc.data();

            gameData.gameId = doc.id;

            const catDoc = await databaseClient.collection("Categories").doc(gameData.categoryId).get();

            const catName = catDoc.data().name;

            gameData.categoryName = catName;
            arr.push(gameData);
        }



        return {
            "response" : arr
        }
    }catch(error){
        console.log(error);
        // Returning an error response if there is a server error
        return{
            message: "internal server error"
        }
    }

}