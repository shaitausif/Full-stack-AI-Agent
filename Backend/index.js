import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import ConnectDB from './db/ConnectDB.js'
import {serve} from 'inngest/express'
import { onUserSignUp } from './inngest/functions/on-signup.js'
import { onTicketCreated } from './inngest/functions/on-ticket-create.js'
import cookieParser from 'cookie-parser'

const app = express()
// It's not a very big application i am building it just for learning purpose that's why i am not following the best practices for designing the backend like using standardized file structure, controllers, db, routes, utils like these cause it's not any big application which will showcase my skills and help me to standout.
dotenv.config()

const allowedOrigins = [
  "http://localhost:5173",
  "https://ticket-ai-two.vercel.app"
];

app.use(cors({
  origin: allowedOrigins, // Must match your frontend origin
  credentials: true
}));


// to accept the json request
app.use(express.json())
app.use(cookieParser())


import userRouter from './routes/user.route.js'
import ticketRouter from "./routes/ticket.route.js"
import { inngest } from './inngest/client.js'
// Routes
app.use("/api/auth", userRouter)
app.use("/api/tickets", ticketRouter)


// Api route for inngest
app.use("/api/inngest", serve({client : inngest, functions : [onUserSignUp, onTicketCreated]}))


// Connecting the backend with the database
ConnectDB()
.then(() => {
    app.listen(process.env.PORT || 8000 ,() => {
        console.log(`Server is running at http://localhost:${process.env.PORT}`)
    })
}).catch((err) => {
    console.log("MongoDB connection failed",err)
})
