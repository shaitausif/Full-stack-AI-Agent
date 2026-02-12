import express from 'express'
import { authenticate } from '../middlewares/auth.middleware.js'
import { createTicket, deleteTicket, getTicket, getTickets } from '../controllers/ticket.controller.js'


const router = express.Router()


router.route("/").post(authenticate, createTicket)
router.route("/").get(authenticate, getTickets)
router.route("/:id").get(authenticate, getTicket)
router.route("/:id").delete(authenticate, deleteTicket)



export default router