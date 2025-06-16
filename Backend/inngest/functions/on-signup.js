import {inngest} from '../client.js'
import User from '../../models/user.model.js'
import { NonRetriableError } from 'inngest'
import { sendMail } from '../../utils/mailer.js'

export const onUserSignUp = inngest.createFunction(
    // The ID of this function
    {id : "on-user-signup"},
    // The event on which this function should execute
    {event : "user/signup"},
    async({event, step}) => {
        try {
            const {userId} = event.data
            const user = await step.run("get-user-email", async() => {
                const userObject = await User.findById(userId)
                if(!userObject){
                    // An error that, when thrown, indicates to Inngest that the function should cease all execution and not retry.
                    throw new NonRetriableError("User no longer exists in our database")
                }
                return userObject


            })

            // The steps in the inngest works same like promises means whatever we return in the step 1 goes directly to step 2

                await step.run("send-welcome-email",async() => {
                    const subject = "Welcome to the App"
                    const message = `Hi,
                    \n\n
                    Thanks for signing up, We're glad to have you onboard!`

                    await sendMail(user.email,subject, message)
                })

                return {success : true}
                
        } catch (error) {
            console.log("Error running step",error.message)
            return {success : false}
        }
    }
)   