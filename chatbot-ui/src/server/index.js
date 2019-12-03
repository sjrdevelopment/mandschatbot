
var get = require('lodash/get');
//
// start DF app
//

const projectId = 'banking-gxdxmk';
const sessionId = '123456';
const queries = ['hello', 'give me my balance']
const languageCode = 'en'

// Imports the Dialogflow library
const dialogflow = require('dialogflow');

// Instantiates a session client
const sessionClient = new dialogflow.SessionsClient();

async function detectIntent(
  projectId,
  sessionId,
  query,
  contexts,
  languageCode
) {
  // The path to identify the agent that owns the created intent.
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode: languageCode,
      },
    },
  };

  if (contexts && contexts.length > 0) {
    request.queryParams = {
      contexts: contexts,
    };
  }

  const responses = await sessionClient.detectIntent(request);

  return responses[0];
}

const WebSocket = require('ws');
 
const wss = new WebSocket.Server({ port: 8081 });
 
console.log('setting up ws')

const sendEvent = ((item, ws, index) => {
  setTimeout(() => {
    const text = get(item.text, 'text')
    text !== undefined && ws && ws.send(text[0])
  }, 1000 * index)
})

const sendCardEvent = ((item, ws, index) => {
  setTimeout(() => {
    ws.send(JSON.stringify(item.card))
  }, 1000 * index)
})

async function executeQueries(projectId, sessionId, queries, languageCode, ws) {
  // Keeping the context across queries let's us simulate an ongoing conversation with the bot
  let context;
  let intentResponse;
  for (const query of queries) {
    try {
      console.log(`Sending Query: ${query}`);
      intentResponse = await detectIntent(
        projectId,
        sessionId,
        query,
        context,
        languageCode
      );
      console.log('Detected intent');
    
      if (intentResponse.queryResult.fulfillmentMessages.length > 1) {
        intentResponse.queryResult.fulfillmentMessages.forEach((item, index) => {
          
          if (item.platform === 'FACEBOOK') {
          
            if (item.card) {
              sendCardEvent(item, ws, index)
            } else {
              sendEvent(item, ws, index)
            }
            
          }
        })
      } else {
        console.log(
          `Fulfillment Text: ${intentResponse.queryResult.fulfillmentText}`
        );
          
  
  
        ws && ws.send(intentResponse.queryResult.fulfillmentText);
        // Use the context from this response for next queries
        context = intentResponse.queryResult.outputContexts;
      }

      
    } catch (error) {
      console.log(error);
    }
  }
}

wss.on('connection', function connection(ws) {
    console.log("established connections")
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        executeQueries(projectId, sessionId, [message], languageCode, ws);
      });
});