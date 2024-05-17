SAIYAM MISHRA (email: saiyam.mishra26@gmail.com)

This project is an Express.js application that integrates user authentication (registration and login) using Passport.js and local strategy with session handling, MongoDB for database storage, and sentiment analysis using the sentiment library. The project also includes routes for profile access and sentiment analysis.

Prerequisites
1.Node.js and npm installed
2.MongoDB Atlas account for database storage

Installation
1.Clone the Repository -> git clone https://github.com/your-username/your-repo.git  ->  cd your-repo
2.Install Dependencies -> npm install
3.Run the Server -> node server.js

API Endpoints

1.Registration

->Endpoint: /register
->Method: POST
->Description: Registers a new user.
->Body Parameters:
email: User's email
username: User's username
password: User's password

->Response:
Success: { message: "Successful" }
Error: { error: "Error message" }

2.Login

->Endpoint: /login
->Method: POST
->Description: Logs in a user.
->Body Parameters:
username: User's username
password: User's password

->Response:
Success: Redirect to /login-success
Failure: Redirect to /login-failure


3.Sentiment Analysis

->Endpoint: /analyze
->Method: POST
->Description: Analyzes the sentiment of a given text.
->Body Parameters:
text: The text to analyze

->Response:
{ sentiment: "positive" | "negative" | "neutral", scores: { ... } }
