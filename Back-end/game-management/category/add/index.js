const databaseClient = require('./firebaseConnection')
exports.lambdaHandler = async (event, context) => {
    const categoryData = event;
    console.log(event);

    try{
        const docRef = await databaseClient.collection('Categories').add({
            name : categoryData.name
        })
        console.log(docRef);
        return {
            "categoryId" : docRef.id
        }

    }catch(error){
        console.log(error);
        // Returning an error response if there is a server error
        return {
            "message" : " internal server error"
        }

    }
}