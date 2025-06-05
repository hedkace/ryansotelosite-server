const express = require('express')
const http = require('http')
const cors = require('cors')
require('dotenv').config()
const mailer = require('nodemailer')


const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(cors({
    origin: ["https://ryansotelo.site", "https://ryansotelo.work"],
    methods: ["GET", "POST"]
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
    let successful = true
    transporter.sendMail(mailOptions, (error, info)=>{
        if(error){
            console.log('Error', error)
            successful = false
        }
        else{
            console.log("Email sent: ", info.response)
        }
    })
    transporter.sendMail(mailOptions2, (error, info)=>{
        if(error){
            console.log('Error', error)
            successful = false
        }
        else{
            console.log("Email sent: ", info.response)
        }
    })
    return successful
}




//routes

app.get('/', (req,res)=>{
    res.json('test ok')
})

app.post("/sendEmailFromSiteForm",(req,res)=>{
    const {
        emailAddress, emailSubject, emailBody
    } = req.body
    try {
        let result = sendEmail(emailAddress, emailSubject, emailBody, "site")
        if(result) res.status(200)
        else res.status(500)
    } catch (error) {
        res.status(500)
    }
})


app.post("/sendEmailFromWorkForm",(req,res)=>{
    const {
        emailAddress, emailSubject, emailBody
    } = req.body
    try {
        let result = sendEmail(emailAddress, emailSubject, emailBody, "work")
        if(result) res.status(200)
        else res.status(500)
    } catch (error) {
        res.status(500).json(error)
    }
})

app.listen(8080 , ()=>{
    'Server started on port 8080.'
})