import { inngest } from "./client.js"; // Your Inngest client

export const keepAliveFn = inngest.createFunction(
  { id: "render-keep-alive" },
  { cron: "*/1 * * * *" }, // Runs every 14 minutes to beat the 15-minute limit
  async ({ event, step }) => {
    await step.run("ping-server", () => {
        console.log("Render server, wake up!")
      return { 
        status: "success", 
        timestamp: new Date().toISOString(),
        message: "Render instance kept awake" 
      };
    });
  }
);