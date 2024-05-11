const mongoose = require('mongoose')
const Shorturl = require('../../schema/shorturl/shorturl')
const axios = require('axios')

const find = async () => {
    try {
        const data = await Shorturl.find({})

        if (!data || data.length === 0) {
            const resp = await ({ success: false, message: "Data not found" })
            return resp
        }

        return data
    } catch (error) {
        console.error('Error fetching data:', error)
        throw error
    }
}

const create = async (req) => {
    try {
        const generateUniqueString = async (length) => {
            let result = ''
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
            const charactersLength = characters.length
            let isDuplicate = true
        
            while (isDuplicate) {
                result = ''
                for (let i = 0; i < length; i++) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength))
                }

                const existingData = await Shorturl.findOne({ s_url: result })
        
                if (!existingData) {
                    isDuplicate = false
                }
            }
        
            return result
        }

        const isDuplicateCUrl = async (cUrl) => {
            const existingData = await Shorturl.findOne({ c_url: cUrl })
            
            if (existingData) {
                return true
            } else {
                return false
            }
        }

        const sendDiscordMessage = async (webhookURL, message) => {
            try {
                await axios.post(webhookURL, { content: message }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                console.log('Message sent successfully to Discord')
            } catch (error) {
                console.error('Error sending message to Discord:', error)
            }
        }

        if (!req.o_url) {
            return { success: false, message: 'Data is required!' }
        }

        const existingData = await isDuplicateCUrl(req.c_url)

        if (existingData == true) {
            return { success: false, message: 'Existing Data!' }
        }

        const s_url = await generateUniqueString(5)

        const createurls = await Shorturl.create({ o_url: req.o_url, s_url, c_url: req.c_url })

        if (createurls) {
            const webhookURL = 'https://discord.com/api/webhooks/1166818200009310209/lUr7Rji6poYseh_93JQSISTX-9LCYER8YhB-4CWNsLCdXlEekilUeCIqC25UiJ6QySfZ';
            const message = 'มีการสร้าง url ใหม่';
            
            sendDiscordMessage(webhookURL, message);
        }
        
        return { success: true, message: 'ShortUrl created successfully' };
    } catch (error) {
        console.error('Error creating data:', error)
        throw error
    }
}

module.exports = {
    find,
    create
}