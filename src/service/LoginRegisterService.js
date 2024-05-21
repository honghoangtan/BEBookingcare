import bcrypt from 'bcrypt'

import db from '../models/index'

const salt = bcrypt.genSaltSync(10)

const checkPassWord = (inputPassword, hashPassword) => {
    return bcrypt.compareSync(inputPassword, hashPassword)
}

const hashUserPassword = (userPassword) => {
    let hashPassword = bcrypt.hashSync(userPassword, salt)
    return hashPassword
}

const checkEmailExist = async (userEmail) => {
    let user = await db.User.findOne({
        where: { email: userEmail }
    })

    if (user) {
        return true
    }

    return false
}

const handleUserLogin = async (email, password) => {

    try {

        let user = await db.User.findOne({
            where: {
                email: email
            },
            raw: true
        })
    
        if (user) {

            let isCorrectPassword = checkPassWord(password, user.password)

            console.log(">>> CHECK INFOR USER: ", user)

            if (isCorrectPassword) {

                return {
                    EM: 'ok!',
                    EC: 0,
                    DT: {
                        email: user.email,
                        firstname: user.firstName,
                        lastname: user.lastName,
                        roleId: user.roleId,
                        id: user.id
                    }
                }
            }
        }
        return {
            EM: 'Your email/ phone number or password is incorrect',
            EC: 1,
            DT: ''
        }
    } catch(e) {
        return {
            EM: 'Something wrongs in service...',
            EC: -2
        }
    }
}

module.exports = {
    handleUserLogin,
    checkEmailExist,
    hashUserPassword
}