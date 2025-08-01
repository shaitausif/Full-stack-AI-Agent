
// import TicketEmail from "../emails/TicketEmail";

// // Here, in this file we're sending verification email to the respective email address with exception handling
// // Emails are always asynchronous
// export async function sendTicketEmail(
//     email,
//     ticketId
// ){
//     try {
//         await resend.emails.send({
//             from: 'Ticket AI <onboarding@resend.dev>',
//             to: email,
//             subject: 'Ticket AI | Ticket Assigned',
//             react: TicketEmail({email, ticketId}),
//           });

//         return {success : true, message : 'Ticket sent successfully.'}
//     } catch (emailError) {
//         console.error('Email sending error:',emailError)
//         return {success : false, message : 'Failed to send Verification email'}
//     }
// }