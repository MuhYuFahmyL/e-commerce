// server.js
require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3000
const session = require('express-session')
const flash = require('express-flash')
// Pertama, setting request body parser
// (Ingat! Body parser harus ditaruh paling atas)
app.use(express.urlencoded({ extended: true }))

// Kedua, setting session handler
app.use(session({
    secret: 'Buat ini jadi rahasia',
    resave: false,
    saveUninitialized: false
}))

// Ketiga, setting passport 
// (sebelum router dan view engine)
const passport = require('./lib/passport')
app.use(passport.initialize())
app.use(passport.session())

// Keempat, setting flash
app.use(flash())

// Kelima, setting view engine
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '../public'));
// app.use(express.static(__dirname + '/public'))

// Keenam, setting router
app.use(cors())
const router = require('./routes/router')
app.use(router)

app.listen(port, () => {
    console.log(`Server nyala di port ${port}`)
})
