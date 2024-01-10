const databaseClient = require('./firebaseConnection')
exports.lambdaHandler = async (event, context) => {
    const questionsData = event;
    try{
        let filteredQuestion = await databaseClient.collection('Questions');

        if(questionsData.categoryId){
            filteredQuestion = filteredQuestion.where('categories', '==', questionsData.categoryId);
        }
        if(questionsData.difficulty){
            filteredQuestion = filteredQuestion.where('difficulty', '==', questionsData.difficulty);
        }
        const documents = await filteredQuestion.get();
        const arr = [];
        documents.forEach((document) =>{
            arr.push(document.data());

        })


        return arr;
    }catch(error){
        console.log(error);
        // Returning an error response if there is a server error
        return { message: "internal server error" };
    }
}