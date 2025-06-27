const express = require('express')
const cors = require('cors')
require('dotenv').config() // this loads .env variables
const db = require('./config/db')
const router = require('./routes/authRoutes')
const courseRoutes = require('./routes/courseRoutes'); // ✅ New line
const cartRoutes = require('./routes/cartRoutes'); // 📘 Cart management
const orderRoutes = require('./routes/orderRoutes'); // ✅ Add this line
const lessonRoutes = require('./routes/lessonRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes'); // 🟩 Favorites
const categoryRoutes = require('./routes/categoryRoutes') // ✅ Added this
const progressRoutes = require('./routes/progressRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const paymentRoutes = require('./routes/paymentRoutes');


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
app.use('/api', courseRoutes);        // 📘 Course management
app.use('/api/cart', cartRoutes); // All cart routes will be under /api/cart
app.use('/api/orders', orderRoutes);  // 🧾 Orders ✅
app.use('/api/lessons', lessonRoutes);
app.use('/api/favorites', favoriteRoutes); // 🟢 Favorites routes
app.use('/api/categories', categoryRoutes) // ✅ Category routes added here
app.use('/api/progress', progressRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/payment', paymentRoutes);





// start server
const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`server running on port ${PORT}`))