import express from 'express'
import { authenticateUser, forgotPassword, getProfile, getUsers, login, logout, resetPassword, searchUser, signUp, updateProfile, updateUser, verifyOtp } from '../controllers/user.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'


const router = express.Router()


router.route("/signup").post(signUp)
router.route("/login").post(login)
router.route("/logout").post(logout)
router.route("/forgot-password").post(forgotPassword)
router.route("/verify-otp").post(verifyOtp)
router.route("/reset-password").post(resetPassword)

// authenticated routes
router.route("/update-user").post(authenticate, updateUser)
router.route("/users").get(authenticate, getUsers)
router.route("/search/:email").get(searchUser)

// Profile routes
router.route("/profile").get(authenticate, getProfile)
router.route("/profile").put(authenticate, updateProfile)

// Send the user authentication authority to the front-end
router.route("/me").get(authenticate, authenticateUser)

export default router   