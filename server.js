const express = require('express')
const cors = require('cors')
require('dotenv').config() // this loads .env variables
const db = require('./config/db')
const router = require('./routes/authRoutes')

//this connects to MongoDB
db()

const app = express()

// Middleware to parse json and handle cors
app.use(cors())
app.use(express.json())

//test route
app.get('/', (req,res)=> {
    res.send('API is running...')
})

 //auth routes
app.use('/api/auth', router)

// start server
const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`server running on port ${PORT}`))