const express = require('express')
const http = require('http')
// const cors = require('cors')
require('dotenv').config()
const mailer = require('nodemailer')


const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

// app.use(cors({
//     credentials: true,
//     origin: process.env.REACT_URL,
// }))



//email middleware



const transporter = mailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GAU,
        pass: process.env.GAP
    }
})

async function sendEmail(emailAddress, emailSubject, emailBody, from="site"){
    let message = "<h1>"+emailSubject+"</h1>"
    message += "<p>Email from contact form on ryansotelo."+from+"</p>"
    message += "<br><br>"
    message += "<h2>" + emailBody + "</h2>"
    message += "<br><br>"
    message += "<p>From: "+emailAddress+"</p>"
    message += "<br><br>"
    message += "<p>From: "+Date.now()+"</p>"
    const mailOptions = {
        form: process.env.GAU,
        to: process.env.CONTACT_EMAIL,
        subject: emailSubject + " | Contact Form",
        html: message
    }

    transporter.sendMail(mailOptions, (error, info)=>{
        if(error){
            console.log('Error', error)
            return {success: false, error: error}
        }
        else{
            console.log("Email sent: ", info.response)
            return {success: true, info:info.response}
        }
    })
}




//routes

app.get('/', (req,res)=>{
    res.json('test ok')
})

app.post("/sendEmailFromSiteForm",(req,res)=>{
    const {
        emailAddress, emailSubject, emailBody
    } = req.body
    sendEmail(emailAddress, emailSubject, emailBody, "site")
})


app.post("/sendEmailFromWorkForm",(req,res)=>{
    const {
        emailAddress, emailSubject, emailBody
    } = req.body
    sendEmail(emailAddress, emailSubject, emailBody, "work")
})