const express = require('express')
const http = require('http')
const cors = require('cors')
require('dotenv').config()
const mailer = require('nodemailer')


const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(cors({
    origin: ['https://ryansotelo.site', 'https://ryansotelo.work']
}))



//email middleware



const transporter = mailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GAU,
        pass: process.env.GAP
    }
})

async function sendEmail(emailAddress, emailSubject, emailBody, from="site"){
    const options = { timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const currentDate = new Date().toLocaleString('en-US', options);
    let message = "<h1>"+emailSubject+"</h1>"
    message += "<p>Email from contact form on ryansotelo."+from+"</p>"
    message += "<br><br>"
    message += "<h2>" + emailBody + "</h2>"
    message += "<br><br>"
    message += "<p>Reply to: "+emailAddress+"</p>"
    message += "<br><br>"
    message += "<p>At: "+currentDate+"</p>"
    const mailOptions = {
        form: process.env.GAU,
        to: process.env.CONTACT_EMAIL,
        subject: emailSubject + " | Contact Form",
        html: message
    }
    const mailOptions2 = {
        form: process.env.GAU,
        to: emailAddress,
        subject: "Thank you for reaching out!",
        html: "<em>Thank you for reaching out! This message was sent to Ryan Sotelo.</em><br><br>"+message
    }

    try {
        const mail1 = await transporter.sendMail(mailOptions)
        const mail2 = await transporter.sendMail(mailOptions2)
        console.log(mail1)
        console.log(mail2)
        const responseData = {mail1, mail2}
        console.log(responseData)
        if(mail1?.accepted?.length > 0) return {success: true, data: responseData}
        else return {success: false, data: responseData}
    } catch (error) {
        console.log(error)
        return {success: false, data: error}
    }
}




//routes

app.get('/', (req,res)=>{
    res.json('test ok')
})

app.post("/sendEmailFromSiteForm",async (req,res)=>{
    const {
        emailAddress, emailSubject, emailBody
    } = req.body
    try {
        sendEmail(emailAddress, emailSubject, emailBody, "site")
            .then(result => {
                if(result.success) res.status(200).json({success: true, message: "Message sent successfully", data: result.data})
                else res.status(500).json({success: false, message: "error", data: result.data})
            })
    } catch (error) {
        res.status(500).json({success: false, message: "error", error})
    }
})


app.post("/sendEmailFromWorkForm",async (req,res)=>{
    const {
        emailAddress, emailSubject, emailBody
    } = req.body
    try {
        sendEmail(emailAddress, emailSubject, emailBody, "work")
            .then(result => {
                if(result.success) res.status(200).json({success: true, message: "Message sent successfully", data: result.data})
                else res.status(500).json({success: false, message: "error", data: result.data})
            })
    } catch (error) {
        res.status(500).json({success: false, message: "error", error})
    }
})

app.listen(8080 , ()=>{
    console.log('Server started on port 8080.')
})