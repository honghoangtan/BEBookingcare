import bcrypt from 'bcrypt'

import db from '../models/index'


var salt = bcrypt.genSaltSync(10)


let createNewUser = async (data) => {

    return new Promise(async(resolve, reject) => {
        try {
            let hashPassword = await(hashUserPassword(data.password))

            await db.User.create({
                ...data, password: hashPassword
            })
            
            resolve('ok! create a new user success')
        } catch(e) {
            reject(e)
        }
    })

}

let getAllUser = () => {
    return new Promise(async(resolve, reject) => {
        try {
            let users = db.User.findAll({
                raw: true
            })

            resolve(users)
            
            resolve('ok! create a new user success')
        } catch(e) {
            reject(e)
        }
    })
}

let hashUserPassword = async (password) => {
    return new Promise(async(resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt)
            resolve(hashPassword)
        } catch (e) {
            reject(e)
        }
    })
}

let getUserInfoById = async (userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId }, 
                raw: true
            })

            if (user) {
                resolve(user)
            } else {
                resolve({})
            }


        } catch (e) {
            reject(e)
        }
    })
}

let updateUser = async (firstName, lastName, address, id) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: id }, 
                raw: true
            })

            if (user) {

                await db.User.update(
                    { firstName: firstName,
                        lastName: lastName,
                        address: address,
                    }, {
                    where: {
                      id: id
                    }
                  });

               let allUser = await db.User.findAll()
                resolve(allUser)
            }  else {
                resolve()
            }
            

        } catch (e) {
            reject(e)
        }
    })
}

const deleteUserById = async (id) => {
    return new Promise(async(resolve, reject) => {
        try {
            
            await db.User.destroy({
                where: { id: id}
            })

            resolve()

        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createNewUser,
    getAllUser,
    getUserInfoById,
    updateUser,
    deleteUserById
}