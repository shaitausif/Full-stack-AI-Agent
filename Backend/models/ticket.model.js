import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
    {
        title : String,
        description : String,
        status : {
            type : String,
            default : "TODO",
            enum : ["TODO","PENDING","IN PROGRESS"]
        },
        createdBy : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        assignedTo : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            // Because AI will decide whom to assign the task of the ticket which will take sometime
            default : null
        },
        priority : String,
        deadline : Date,
        helpfulNotes : String,
        relatedSkills : [String],
        
    }
    ,{timestamps : true}
)


const Ticket =  mongoose.model("Ticket",ticketSchema)
export default Ticket