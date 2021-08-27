// controllers/authController.js
const { User } = require('../models')
const passport = require('../lib/passport')
function format(user) {
    const { id, username, type } = user
    User.update({ 
        token:user.generateToken (), 
    }, { where: { id: id } })
    .then((data) => {
        console.log('Token Added')
    })
    .catch((err) => {
        console.log(err)
    })
    return {
     id,
     username,
     type,
     accessToken : user.generateToken ()
    }
}
    
module.exports = {
    register : (req, res, next) => {
        // Kita panggil static method register yang sudah kita buat tadi
        User.register (req.body)
        .then(user => {
            res.json(
                {
                    message:"Register Success",
                    data:user
                }
            )
            // res.redirect ('/login')
        })
        .catch(err => next(err))
    },

    login: (req, res) => {
        User.authenticate(req.body)
        .then(user => {
            res.json(
                {
                    message:"Login Success",
                    data:format(user)
                }
            )
        })
        .catch(err => {
            res.json(
                {
                    message:err
                }
            )
        })
    },
       
    whoami: (req, res) => {
        /* req.user adalah instance dari User Model, hasil autentikasi dari passport. */
        const currentUser = req.user;
        res.json(currentUser)
        // res.render('profile', req.user.dataValues)
    },

    // untuk mendapatkan 1 user by id
    getOne: (req, res) => {
        User.getOne (req.params)
        .then(user => {
            res.json(
                {message:"Data Found",data:user}
            )
        })
        .catch(err => {
            res.json(
                {
                    message:err
                }
            )
        })
    },

    // untuk mendapatkan 1 user by id
    getAll: (req, res) => {
        User.getAll()
        .then(user => {
            res.json(
                {message:"Data Found",data:user}
            )
        })
        .catch(err => {
            res.json(
                {
                    message:err
                }
            )
        })
    },

    // untuk delete
    delete: (req, res) => {
        User.delete(req.params)
        .then(user => {
            res.json(
                {message:"Success Delete User",user}
            )
        })
        .catch(err => {
            res.json(
                {
                    message:err
                }
            )
        })
    },

    // untuk update
    update: async (req, res) => {
          if (!req.params.id) {
            res.json({message:"Select User!!!"})
          } else {
            const user_data = await User.findOne({ where: { id:req.params.id }})
            if(!user_data) res.json({message:"User Not Found"})
            try {
              const users = await User.update({ 
                username:req.body.username!==undefined?req.body.username:user_data.username, 
                password:req.body.password!==undefined?User.globalencrypt(req.body.password):User.globalencrypt(user_data.password), 
                firstName:req.body.firstName!==undefined?req.body.firstName:user_data.firstName, 
                lastName:req.body.lastName!==undefined?req.body.lastName:user_data.lastName, 
                email:req.body.email!==undefined?req.body.email:user_data.email, 
                type:req.body.type!==undefined?req.body.type:user_data.type
              },{where:{id:req.params.id}})  
              res.json({message:"Success",data:users})
            }catch(err){
              res.json({message:err})
            }
          }
    },
       
}