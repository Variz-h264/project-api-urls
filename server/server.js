require('dotenv').config()
const fastify = require('fastify')({ logger: false })
const mongoose = require('mongoose');
const path = require('path')

const app = fastify

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.register(require('@fastify/cors'), {
    origin: ['http://localhost:4022', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
})

app.register(require('@fastify/static'), {
    root: path.join(__dirname, 'views'),
    prefix: '/',
});

app.get('/', function (request, reply) {
    reply.sendFile('home.html');
})

app.register(require('./controller/shorturl/shorturl'));

const start = async () => {
    try {
        const port = process.env.PORT || 4000
        await app.listen({ port: port }).then(() => {
            console.log(`start @ server => http://localhost:${port}`)
        })
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}

module.exports = start