'use strict';
const {
  Model
} = require('sequelize');
/* Pertama, kita import bcrypt untuk melakukan enkripsi */
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    // Method untuk melakukan enkripsi
    static #encrypt = (password) => bcrypt.hashSync (password, 10)
    static globalencrypt = (password) => bcrypt.hashSync (password, 10)

    // Lalu, kita buat method register
    static register = async ({ username, password, firstName, lastName, email, type }) => {
      
  
      /*
        #encrypt dari static method
        encryptedPassword akan sama dengan string 
        hasil enkripsi password dari method #encrypt
      */
      try {
        const encryptedPassword = this.#encrypt(password)
        const user = await this.create({ username, password : encryptedPassword, firstName, lastName, email, type })
        return Promise.resolve(user)
      } catch(err) {
        return Promise.reject(err)
      }
    }

    /* Method .compareSync digunakan untuk mencocokkan plaintext dengan hash. */
    checkPassword = password => bcrypt.compareSync(password, this.password)
    /* Method ini kita pakai untuk membuat JWT */
    generateToken = () => {
      // Jangan memasukkan password ke dalam payload
      const payload = {
        id: this.id,
        username: this.username,
        // type: this.type
      }
      // Rahasia ini nantinya kita pakai untuk memverifikasi apakah token ini benar-benar berasal dari aplikasi kita
      const rahasia = 'Ini rahasia ga boleh disebar-sebar'
      // Membuat token dari data-data diatas
      const token = jwt.sign(payload, rahasia)
      return token
    }

    /* Method Authenticate, untuk login */
    static authenticate = async ({ username, password }) => {
      try {
        const user = await this.findOne({ where: { username }})
        if (!user) return Promise.reject("User not found!")
        const isPasswordValid = user.checkPassword(password)
        if (!isPasswordValid) return Promise.reject("Wrong password")
        return Promise.resolve(user)
      } catch(err) {
        return Promise.reject(err)
      }
    }

    /* Method getOne, untuk getOne */
    static getOne = async ({ id }) => {
      try {
        const user = await this.findOne({ where: { id }})
        if (!user) return Promise.reject("User not found!")
        return Promise.resolve(user)
      } catch(err) {
        return Promise.reject(err)
      }
    }

    // method getAll, utk selectAll
    static getAll = async () => {
      try {
        const user = await this.findAll()
        if (!user) return Promise.reject("Data not found!")
        return Promise.resolve(user)
      } catch(err) {
        return Promise.reject(err)
      }
    }

    // method delete
    static delete = async ({ id }) => {
      try {
        const user = await this.destroy({ where: { id }})
        if (!user) return Promise.reject("User not found!")
        return Promise.resolve(user)
      } catch(err) {
        return Promise.reject(err)
      }
    }

    // method update
    // static update = async (req,id) => {
          // if (!id) {
          //   return Promise.reject("Select User!!!")
          // } else {
          //   const user_data = this.findOne({ where: { id:id }})
          //   if(!user_data) return Promise.reject("User Not Found")
          //   try {
          //     const users = await this.create({ 
          //       username:req.username!==undefined?req.username:user_data.username, 
          //       password:req.password!==undefined?this.#encrypt(req.password):this.#encrypt(user_data.password), 
          //       firstName:req.firstName!==undefined?req.firstName:user_data.firstName, 
          //       lastName:req.lastName!==undefined?req.lastName:user_data.lastName, 
          //       email:req.email!==undefined?req.email:user_data.email, 
          //       type:req.type!==undefined?req.type:user_data.type
          //     })  
          //     return Promise.resolve(users)
          //   } catch (error) {
          //     return Promise.reject(err) 
          //   }
          // }  
    // }
  };
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    type: DataTypes.STRING,
    status: DataTypes.STRING,
    // cartID: DataTypes.STRING,
    token: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};