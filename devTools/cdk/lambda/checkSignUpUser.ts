exports.handler = (event: any, context: any, callback: any) => {
  console.log(event)
  if (event.userName !== process.env.FACEBOOK_ID) {
      var error = new Error("Cannot authenticate user");

      // Return error to Amazon Cognito
      callback(error, event);
  }

  // Return to Amazon Cognito
  callback(null, event);
};