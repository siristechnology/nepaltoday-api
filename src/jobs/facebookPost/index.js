const axios = require('axios')
const { newsDbService } = require('../../db-service')
const { verifyFacebookPostTime } = require('./facebookPostHelper')
const page_id = 102217588264766
const { FacebookLongLiveToken } = require('./../../db-service/database/mongooseSchema')

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
            }
        }

    } catch (error) {
        console.log("error here",error)
    }
}