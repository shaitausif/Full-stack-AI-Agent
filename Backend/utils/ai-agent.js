import { createAgent, gemini } from "@inngest/agent-kit";


export const analyzeTicket = async(ticket) => {
    const supportAgent = createAgent({
        model : gemini({
            model : "gemini-2.0-flash",
            apiKey : process.env.GEMINI_API_KEY
        }),
        name : "AI Ticket Triage Assistant",
        system : `You are an expert AI assistant that processes technical support tickets
        
        Your job is to: 
        1. Summarize the issue.
        2. Estimate its priority.
        3. Provide helpful notes and resource links for human moderators.
        4. List relevant technical skills required.

        IMPORTANT:
        - Respond with only valid raw JSON.
        - Do not include markdown, code fences, comments, or any other extra formatting.
        - The format must be a raw JSON object.


        Repeat: Do Not wrap your output in markdown or code fences.
        `
    })

    const response = await supportAgent.run(`You are a ticket triage agent. Only return a strict JSON object with no extra text, headers or markdown
        
    Analyze the following support ticket and provide a JSON object with : 


    - summary: A short 1-2 sentence summary of the issue.
    - priority: One of "low", "medium" or "high".
    - helpfulnotes: A detailed technical explanation that a moderator can use to solve the issue. Include useful external links or resources if possible.
    
    - relatedSkills: An array of relevant skills required to solve the issue (e.g. ["React","MongoDB"]).

    Respond only in this JSON format and do not include any other text of markdown in the answer:

    {
    "summary" : "Short summary of the ticket",
    "priority" : "high",
    "helpfulNotes" : "Here are helpful tips...",
    "relatedSkills" : ["React","NodeJS"]
    }


    --- 

    Ticket Information:

    - Title : ${ticket.title}
    - Description : ${ticket.description}
        `)


    // Here to receive the data
    const raw = response.output[0].content

    try {
        // It's to correct if the AI is giving us the response is not in the desired one
        const match = raw.match(/```json\s*([\s\S]*?)\s```/i)
        const jsonString = match ? match[1] : raw.trim()
        // convert the JSON into a javascript object
        return JSON.parse(jsonString)
    } catch (error) {
        console.log("Failed to parse JSON from AI response" + error.message)
        return null;
    }


}