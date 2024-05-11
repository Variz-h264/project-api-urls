const { find, create } = require('../../service/shorturl/shorturl')

const routes = async(router) => {
    router.get('/shorturl', async (req, res) => {
        return find()
    })

    router.post('/shorturl/create', async (req, res) => {
        const  { o_url, c_url, ip } = req.body
        try {
            const result = await create({ o_url, c_url, ip })
            return result
        } catch (error) {
            console.error('Error creating data:', error)
            throw error
        }
    })
}

module.exports = routes;