const axios = require('axios')
const { newsDbService } = require('../../db-service')
const { verifyFacebookPostTime } = require('./facebookPostHelper')
const page_id = 102217588264766
const { FacebookLongLiveToken } = require('./../../db-service/database/mongooseSchema')
require('dotenv').config()

module.exports = async function(){

    try {
        const verifyPostEligibleTime = verifyFacebookPostTime()
        if(verifyPostEligibleTime){   
            const facebookLongLiveTokens = await FacebookLongLiveToken.findOne({}, {}, { sort: { createdDate: -1 } }).lean()
            if(facebookLongLiveTokens){
                const pageTokens = await axios.get(encodeURI(`https://graph.facebook.com/${page_id}?fields=access_token&access_token=${facebookLongLiveTokens.longLiveToken}`))
                const latestArticle = await newsDbService.getLatestNewsArticle()
                let articleTitle = latestArticle[0].title
                let articleLink = latestArticle[0].link
                await axios.post(encodeURI(`https://graph.facebook.com/${page_id}/feed?message=${articleTitle}&link=${articleLink}&access_token=${pageTokens.data.access_token}`))
                console.log("posted to faceboook")
            
                // updating token
                let currentTimeStamp = Date.now()
                let lastUpdatedTokenTime = new Date(facebookLongLiveTokens.createdDate)
                let lastUpdatedTimeStamp = lastUpdatedTokenTime.getTime()
                let diff = (currentTimeStamp-lastUpdatedTimeStamp)/1000
                if(diff>4320000){    //50 days
                    let myToken = await axios.get(encodeURI(`https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FACEBOOK_CLIENT_ID}&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&fb_exchange_token=${facebookLongLiveTokens.longLiveToken}`))
                    let toSaveData = new FacebookLongLiveToken({
                        longLiveToken: myToken.data.access_token
                    })
                    await toSaveData.save()
                }
            }

        }

    } catch (error) {
        console.log("error here",error)
    }
}