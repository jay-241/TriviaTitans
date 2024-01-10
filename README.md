# TriviaTitans: A Serverless multi-cloud online trivia game

## Getting Started

### **Description:**

Trivia Titans is a multi-cloud serverless online trivia game that allows users to form teams, compete against other teams in real time, and track their progress on global and category-specific leaderboards.

The primary goal of this project is to comprehend and implement a microservices architecture. Each microservice is created using either AWS or GCP services. The front end is exclusively deployed on GCP Cloud Run, while the backend services operate as Google Cloud Functions or AWS Lambda functions.

### **Prerequisites:**

Before using this project, you'll need to have the following installed:

- AWS and GCP accounts with permission to use necessary services
- Node version 18.0 or higher 
- A text editor (Visual Studio Code, Atom, Sublime Text, etc.)
- Git
- npm version 8.0 or higher

### **AWS Services Used**

| Service | Purpose |
| --- | --- |
| `AWS Cognito` | To authenticate and authorize the users|
| `Lambda` | To configure serverless architecture that runs backend APIs |
| `DynamoDB` | To store the user data and team data  |
| `API Gateway` | To create an API that takes the data from the front end and puts it on AWS SQS  |
| `SQS` | To hold the payload from the API Gateway that will trigger the lambda  |
| `SNS` | To send an email notification to users |
| `AWS Lex` | To implement the chatbot that helps users with navigation, ranking, and scores  |


### **GCP Services Used**

| Service | Purpose |
| --- | --- |
| `Cloud function` | To host the APIs for 2-factor authentication |
| `Cloud Run` | To deploy and run the front end of an application |
| `Firestore` | To store the user login question answer |
| `Big Query` | To store the score and rankings that can be used for analysis  |
| `Looker Studio` | To show the leaderboard for teams and users |
