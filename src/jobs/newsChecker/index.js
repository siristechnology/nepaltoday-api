const { Article } = require("../../db-service/database/mongooseSchema")
const { getAllSources } = require("../../db-service/newsDbService")
const nodeMailer = require('nodemailer')
const logger = require("../../config/logger")

module.exports = async function(){
    try{
        const lastDay = new Date((new Date()).getTime() - 24 * 60 * 60 * 1000)
        for(const source of getAllSources()){
            const todayArticles = await Article.find({
                sourceName: source.sourceName,
                createdAt: { $gte: lastDay }
            })
            if(todayArticles.length==0){
                sendMail(source.sourceName)
            }       
        }
    }catch(error){
        logger.info("News checker error ", error)
    }
    logger.info("News checker job completed")
}

const sendMail = async (sourceName) => {
    try{
        const transporter = nodeMailer.createTransport({
            service:'gmail',
            auth:{
                user: process.env.NOTIFY_EMAIL_ID,
                pass:process.env.NOTIFY_EMAIL_PASSWORD
            }
        })

        const mailOptions = {
            from: process.env.NOTIFY_EMAIL_ID,
            to: process.env.RECEIVER_MAILS,
            subject: 'Articles not being fetched from library through '+sourceName,
            text: 'Articles not being fetched from library through '+sourceName
        }

        await transporter.sendMail(mailOptions)

    }catch(error){
        logger.info("Error while sending mail ",error)
    }
}