const FireBaseConnection = require('@google-cloud/firestore');

// Creating a new instance of the Firebase connection
const databaseClient = new FireBaseConnection({
    projectId: 'module7sdp8', // The ID of the Firebase project
    keyFilename: 'key.json', // The filename of the service account key JSON file
});

// Exporting the database client instance for external use
module.exports = databaseClient;
