const databaseClient = require('./firebaseConnection')
exports.lambdaHandler = async (event, context)=>{
        const categoryData = event;
        console.log(event);

        try{
            const categories = await databaseClient.collection('Categories').get();
            const arr = [];
            categories.forEach((category)=>{
                arr.push({
                    id : category.id,
                    name : category.data().name
                })
            })
           return{

                "categories" : arr
            }

        }catch(error){
            console.log(error);
            // Returning an error response if there is a server error
            return {
                message: "server error"
            }

        }



}