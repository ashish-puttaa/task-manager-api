const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'admin@taskmanagerapp.com',
        subject: 'Task Manager App - Thanks for joining in !',
        text: `Welcome to the app, ${name}. Let me know how you get along.`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'admin@taskmanagerapp.com',
        subject: 'Task Manager App - Sorry to see you go !',
        text: `GoodBye, ${name}. I hope to see you back sometime soon.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}