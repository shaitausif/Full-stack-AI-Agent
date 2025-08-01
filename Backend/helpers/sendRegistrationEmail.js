
// import RegistraionEmail from '../emails/RegistrationEmail'

// // Here, in this file we're sending verification email to the respective email address with exception handling
// // Emails are always asynchronous
// export async function sendRegistrationEmail(
//     email,
// ){
//     try {
//         await resend.emails.send({
//             from: 'Ticket AI <onboarding@resend.dev>',
//             to: email,
//             subject: 'Ticket AI | Registeration Successful',
//             react: RegistraionEmail({email}),
//           });

//         return {success : true, message : 'Registration Email sent successfully.'}
//     } catch (emailError) {
//         console.error('Email sending error:',emailError)
//         return {success : false, message : 'Failed to send Verification email'}
//     }
// }