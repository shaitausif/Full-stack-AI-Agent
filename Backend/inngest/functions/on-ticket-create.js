import { inngest } from "../client.js";
import Ticket from "../../models/ticket.model.js";
import { NonRetriableError } from "inngest";
import { analyzeTicket } from "../../utils/ai-agent.js";
import User from "../../models/user.model.js";
import { sendMail } from "../../utils/mailer.js";


// Here in this function I am building an AI Agent pipeline for tickets
export const onTicketCreated = inngest.createFunction(
    {id : "on-ticket-created", retries : 2},
    {event : "ticket/created"},
    async({event, step}) => {
        try {
            const {ticketId} = event.data   

            const ticket = await step.run("fetch-ticket",async() => {
                // Fetch ticket from the DB
                const ticketObject = await Ticket.findById(ticketId)
                if(!ticketObject)throw new NonRetriableError("Ticket not found")
                return ticketObject
            })

            await step.run("update-ticket-status",async() => {
                await Ticket.findByIdAndUpdate(ticket._id, {status : "TODO"})
            })

            const aiResponse = await analyzeTicket(ticket)

            const relatedSkills = await step.run("ai-processing", async() => {
                let skills = []
                if(aiResponse) {
                    await Ticket.findByIdAndUpdate(ticket._id,
                        {priority : !["low", "medium", "high"].includes(aiResponse.priority) ? "medium" : aiResponse.priority,
                        helpfulNotes : aiResponse.helpfulNotes,
                        status : "IN_PROGRESS",
                        relatedSkills : aiResponse.relatedSkills
                        }
                    )
                    // I am going to use the skills in another step that's why here I am returning it
                    skills = aiResponse.relatedSkills
                }
                return skills
            })

            const moderator = await step.run("assign-moderator",async() => {
                let user = await User.findOne(
                    {
                        role : "moderator",
                        skills : {
                            $elemMatch : {
                                // relatedSkills is an array like ["React", "NodeJS"].join("|") converts it to "React|NodeJS", which means Match either "React" or "NodeJS"
                                $regex : relatedSkills.join("|"),
                                $options : "i" // case insensitive
                            }
                        }
                    }
                )

                if(!user){
                    user = await User.findOne({
                        role : 'admin'
                    })
                }
                await Ticket.findByIdAndUpdate(
                    ticket._id,
                    {
                        assignedTo : user?._id || null
                    }
                )

                return user
            })

            await step.run("send-email-notification", async() => {
                if(moderator){
                    const finalTicket = await Ticket.findById(ticket._id)
                    await sendMail(moderator.email, "Ticket Assigned", `A new ticket is assigned to you ${finalTicket.title} 
                        ${finalTicket.description}
                        `)
                }
            })
            

            return {success : true}

        } catch (error) {
            console.error("Error while running the steps",error.message)
            return {success : false}
        }
    }
)