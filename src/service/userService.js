import db from '../models/index'

import loginRegisterService from './LoginRegisterService'

const getAllUsers = async (userId) => {

    try {
        let users = ''
        if (userId === 'ALL') {
            
            users = await db.User.findAll({
                attributes: {
                    exclude: ['password']
                },
                raw: true
            })
        } else if (userId && userId !== 'ALL') {
            users = await db.User.findOne({
                where: { id: userId },
                attributes: {
                    exclude: ['password']
                },
                raw: true
            })
        }

        if (users) {
            // let data = users.get({ plain: true })
            // findall tu dong convert thanh array khong phai dung cau lenh tren

            return {
                EM: 'get data susccess',
                EC: 0,
                DT: users
            }
        } else {
            return {
                EM: 'get data error',
                EC: 0,
                DT: []
            }
        }
    } catch(e) {
        return {
            EM: 'Something wrongs in service...',
            EC: -2,
            DT: []
        }
    }
}

const createNewUser = async (data) => {
    try {

        if (data.email) {

            let isEmailExist = await loginRegisterService.checkEmailExist(data.email)
            if (isEmailExist) {
                return {
                    EM: 'The email is already exist',
                    EC: 1,
                    DT: 'email'
                }
            }
    
            let hashPassword = await loginRegisterService.hashUserPassword(data.password)
    
            await db.User.create({ ...data, password: hashPassword })
    
            return {
                EM: 'create success',
                EC: 0,
                DT: []
            }
        } else {
            return {
                EM: `You don't have entered your email yet `,
                EC: 1,
                DT: []
            }
        }



    } catch (e) {
        console.log(e)

        return {
            EM: 'some thing wrong with service',
            EC: 1,
            DT: []
        }
    }
} 

const updateUser = async (data) => {
    try {
        let user = await db.User.findOne({
            where: { id: data.id }
        })

        if (user) {
            // update
            await user.update({
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phonenumber: data.phonenumber,
                gender: data.gender,
                roleId: data.roleId,
                positionId: data.positionId,
                image: data.image

            })

            return {
                EM: ' Update user success',
                EC: 0,
                DT: ''
            }
            
        } else if(!user || !data.roleId || !data.positionId || !data.gender) {
            // not found
            return {
                EM: 'User not found',
                EC: 2,
                DT: ''
            }
        }
    } catch (e) {
        return {
            EM: 'some thing wrong with service',
            EC: 1,
            DT: []
        }
    }
}

const deleteUser = async (userId) => {
    try {
        let user = await db.User.findOne({
            where: { id: userId}
          });


        if (user) {
            await user.destroy()
            return {
                EM: 'Ther user is deleted',
                EC: 0,
                DT: []
            }
        } else {
            return {
                EM: 'User not exist',
                EC: 2,
                DT: []
            }
        }

    } catch (e) {
        return {
            EM: 'some thing wrong with service',
            EC: 1,
            DT: []
        }
    }
}

const getAllCodeService = async (typeInput) => {
    try {

        if (!typeInput) {
            return {
                EM: 'Missing required parameter',
                EC: 1,
                DT: []
            }

        } else {
            let allCode = await db.Allcode.findAll({
                where: { type: typeInput }
            })
    
            if (allCode) {
                // let data = users.get({ plain: true })
                // findall tu dong convert thanh array khong phai dung cau lenh tren
    
                console.log('>>>CHECK ALLCODE: ', allCode)
    
                return {
                    EM: 'get data susccess',
                    EC: 0,
                    DT: allCode
                }
            } else {
                return {
                    EM: 'get data error',
                    EC: 0,
                    DT: []
                }
            }
        }

    } catch (e) {
        return {
            EM: 'some thing wrong with service',
            EC: 1,
            DT: []
        }
    }
}

module.exports = {
    getAllUsers,
    createNewUser, 
    updateUser,
    deleteUser,
    getAllCodeService
}