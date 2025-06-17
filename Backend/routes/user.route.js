import express from 'express'
import { authenticateUser, getUsers, login, logout, searchUser, signUp, updateUser } from '../controllers/user.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'


const router = express.Router()


router.route("/signup").post(signUp)
router.route("/login").post(login)
router.route("/logout").post(logout)

// authenticated routes
router.route("/update-user").post(authenticate, updateUser)
router.route("/users").get(authenticate, getUsers)
router.route("/search/:email").get(searchUser)

// Send the user authentication authority to the front-end
router.route("/me").get(authenticate, authenticateUser)

export default router