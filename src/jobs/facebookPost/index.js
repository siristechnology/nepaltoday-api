const { newsDbService } = require('../../db-service')
const { verifyFacebookPostTime } = require('./facebookPostHelper')
const puppeteer = require('puppeteer')
require('dotenv').config()

module.exports = async function(){

    try {
        const verifyPostEligibleTime = verifyFacebookPostTime()
        if(verifyPostEligibleTime){   
            const latestArticle = await newsDbService.getLatestNewsArticle()
            let articleLink = latestArticle[0].link
            const browser = await puppeteer.launch({
                // headless: false,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox'
                ],
                slowMo: 100
            })

            const browserPage = await browser.newPage()
            await browserPage.setDefaultNavigationTimeout(1000000)
            await browserPage.goto(process.env.FACEBOOK_PAGE_LINK)

            await browserPage.waitForSelector('#email')
            await browserPage.type("#email", process.env.FACEBOOK_EMAIL_ID)

            await browserPage.type('#pass', process.env.FACEBOOK_PASSWORD)

            await browserPage.click(`[type="submit"]`)
            await browserPage.waitForNavigation()

            await browserPage.waitForSelector(`[aria-label="Write a post..."]`)
            await browserPage.click(`[aria-label="Write a post..."]`)

            // await browserPage.waitForSelector('div.g9en0fbe > div > img')

            for(let i = 0; i < articleLink.length; i++){
                await browserPage.keyboard.press(articleLink[i])

                if(i === articleLink.length-1){
                    await browserPage.waitFor(2000)
                    await browserPage.keyboard.down('Control')
                    await browserPage.keyboard.press(String.fromCharCode(13))
                    await browserPage.keyboard.up('Control')
                }
            }

            browserPage.close()
        }
    } catch (error) {
        console.log("error here",error)
    }
}