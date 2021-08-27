const router = require('express').Router()
// Controllers
const auth = require('../controllers/authController')
const restrict = require('../middleware/restrict')


// Homepage
router.get('/', restrict, (req, res) => res.render('register'))
// Register Page
router.get('/register' , (req, res) => res.render('register'))
// router.post('/register' , auth.register)

// Register Page
router.post('/api/v1/auth/register', auth.register)
// Login Page
router.post('/api/v1/auth/login', auth.login)

// login page
router.get('/login', (req, res) => res.render('login'))
// // Kemudian letakkan kode ini di file router.js
// router.post('/login', auth.login)

// whoami
router.get('/api/v1/auth/whoami', restrict, auth.whoami)
// getOne
router.get('/api/v1/user/getOne/:id', restrict, auth.getOne)
// getAll
router.get('/api/v1/user/getAll', restrict, auth.getAll)
// delete
router.delete('/api/v1/user/delete/:id', restrict, auth.delete)
// delete
router.put('/api/v1/user/update/:id', restrict, auth.update)
module.exports = router;