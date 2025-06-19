// Inngest invokes your functions securely via an API endpoint at /api/inngest. To enable that, you will create an Inngest client in your project, which you will use to send events and create functions.

// For more : https://www.inngest.com/docs/getting-started/nodejs-quick-start?ref=docs-home&guide=express

// Inngest receives a stream of events, and based on the event type, it automatically invokes the corresponding serverless function (or handler) that you’ve defined for that event.
// Steps to do before deploying the inngest app is first to set the INNGEST_EVENT_KEY in the environment variable from https://app.inngest.com/env/production/onboarding/sync-app?nonVercel=true and then Enter the URL of your application's serve endpoint to register your functions with Inngest. 



import { Inngest } from "inngest";


// Create a client to send and receive events
export const inngest = new Inngest({id : 'ticketing-system',
    eventKey : process.env.INNGEST_EVENT_KEY , // Required in production,
});



