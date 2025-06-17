import { inngest } from "../inngest/client.js";
import Ticket from "../models/ticket.model.js";
import { ApiResponse } from "../utils/apiResponse.js";

// So here First I'll create the ticket and then the background tasks will be handled by the inngest and I will do that by giving the inngest an event of ticket/created for which i had already created a handler also

export const createTicket = async(req, res) => {
    try {
        const {title , description} = req.body
        if(!title || !description) return res.status(400).json(new ApiResponse(400,{},"Title and Description are required"))

        const newTicket = await Ticket.create({title, description, createdBy : req.user._id.toString()})

        await inngest.send({
            name : "ticket/created",
            data : {
                ticketId : newTicket._id
            }
        })

        return res.status(201)
        .json(new ApiResponse(201,{ticket: newTicket},"message : Ticket created and processing started"))

    } catch (error) {
        return res.status(500).json(new ApiResponse(500,{},`Error in creating ticket ${error.message}`))
    }
}



// Get all the tickets will only be allowed to admin and moderator
export const getTickets = async(req, res) => {
    try {
        let tickets = []
        if(req.user?.role !== "user"){
            tickets = await Ticket.find()
            .populate("assignedTo", ["email", "_id"])
            .sort({createdAt : -1})
        }else{
            // And the user can only see the tickets createdby himself
            tickets = await Ticket.find({createdBy : req.user._id })
            .populate("assignedTo", ["email", "_id"])
            .select("title description status createdAt")
            .sort({createdAt : -1})
        }

        return res.status(200)
        .json(new ApiResponse(200,tickets,"Tickets fetched successfully"))
        
    } catch (error) {
        return res.status(500)
        .json(new ApiResponse(500,{},`Failed to get tickets: ${error.message}`))
    }
}


// Get a single ticket
// Allow only the admin and moderator to get the ticket
export const getTicket = async(req, res) => {
    try {
        let ticket;
        if(req.user?.role !== "user"){
            ticket = await Ticket.findById(req.params.id)
            .populate("assignedTo", ["email", "_id"])
            .populate("createdBy",["email","_id"])
        }else{
            ticket = await Ticket.findOne({
                createdBy : req.user?._id,
                _id : req.params.id
            })
            .populate("assignedTo", ["email", "_id"])
            .populate("createdBy",["email","_id"])
                        
        }

        if(!ticket) return res.status(404).json(new ApiResponse(404,{},"Ticket not found"))

        return res.status(200)
        .json(new ApiResponse(200,ticket,"Ticket fetched successfully"))

    } catch (error) {
        return res.status(500)
        .json(new ApiResponse(500,{},`Error in fetching the ticket ${error.message}`))        
    }
}