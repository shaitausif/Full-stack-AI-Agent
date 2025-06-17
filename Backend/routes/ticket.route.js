import express from 'express'
import { authenticate } from '../middlewares/auth.middleware.js'
import { createTicket, getTicket, getTickets } from '../controllers/ticket.controller.js'


const router = express.Router()


router.route("/").post(authenticate, createTicket)
router.route("/").get(authenticate, getTickets)
router.route("/:id").get(authenticate, getTicket)



export default router