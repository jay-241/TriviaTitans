const language = require('@google-cloud/language')
const connection = new language.LanguageServiceClient({
    projectId : 'module7sdp8',
    keyFilename : 'key.json'
})
exports.lambdaHandler = async (event, context) => {

    const subject = event.subject;

    try{
        const [result] = await connection.analyzeEntities({
            document : {
                content : subject,
                type : 'PLAIN_TEXT'
            }

        });

        const tags = result.entities;
        console.log(tags)
        const tagSet = new Set();

        tags.forEach(tag => {
            tagSet.add(tag.type);
        })

        return {
            tags : Array.from(tagSet)
        }


    }catch(error){
        console.log(error);
        // Returning an error response if there is a server error
        return{
            message: "internal server error"
        }
    }

}