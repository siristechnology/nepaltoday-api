const { Article } = require("../../db-service/database/mongooseSchema")
const { getAllSources } = require("../../db-service/newsDbService")
const Mailgun = require('mailgun-js');
const logger = require("../../config/logger")

module.exports = async function(){
    try{
        // const lastDay = new Date((new Date()).getTime() - 24 * 60 * 60 * 1000)
        // for(const source of getAllSources()){
        //     const todayArticles = await Article.find({
        //         sourceName: source.sourceName,
        //         createdAt: { $gte: lastDay }
        //     })
        //     if(todayArticles.length==0){
        //         sendMail(source.sourceName)
        //     }       
        // }
        sendMail('Test')
    }catch(error){
        logger.info("News checker error ", error)
    }
    logger.info("News checker job completed")
}

const sendMail = async (sourceName) => {
    try{
        // const transporter = nodeMailer.createTransport({
        //     service:'gmail',
        //     auth:{
        //         user: process.env.NOTIFY_EMAIL_ID,
        //         pass:process.env.NOTIFY_EMAIL_PASSWORD
        //     }
        // })

        // const mailOptions = {
        //     from: process.env.NOTIFY_EMAIL_ID,
        //     to: process.env.RECEIVER_MAILS,
        //     subject: 'Articles not being fetched from library through '+sourceName,
        //     text: 'Articles not being fetched from library through '+sourceName
        // }

        // await transporter.sendMail(mailOptions)

        const mailgunApiKey = '08683f5bcab9cbc75ca241cd5279ba64-4de08e90-1974be39'
        const domain = 'sandboxb192aca120594916840c0ccd5cb144cd.mailgun.org'
        const from = 'shiva.siristechnology@gmail.com'

        const mailgun = new Mailgun({apiKey: mailgunApiKey, domain: domain});

        const data = {
            from,
            to: 'shivaaryalj7@gmail.com',
            subject:  'Articles not being fetched from library through ',
            text:  'Articles not being fetched from library through '
        }
        await mailgun.messages().send(data)


    }catch(error){
        logger.info("Error while sending mail ",error)
    }
}