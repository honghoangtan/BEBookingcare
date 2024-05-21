import LoginRegisterService from '../service/LoginRegisterService'

import userService from '../service/userService'


const handleLogin = async (req, res) => {

    try {
        let email = req.body.email
        let password = req.body.password

        if (!email || !password) {
            return res.status(500).json({
                EM: 'Missing inputs parameter',
                EC: 1,
                DT: ''
            })
        }
        let data = await LoginRegisterService.handleUserLogin(email, password)

        if (data && data.EC === 0) {
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            })
        }

        if (data && data.EC !==0) {
            return res.status(401).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            })
        }

    } catch (e) {
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '' // date
        })
    }

    
}

const handleGetAllUser = async (req, res) => {
    let id = req.query.id

    if (id) {

        let data = await userService.getAllUsers(id)
        
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        })
    } else {
        return res.status(200).json({
            EM: 'Missing required parameter',
            EC: 1,
            DT: []
        })
    }
}

const handleCReateNewUser = async (req, res) => {
    try {
        let data = await userService.createNewUser(req.body)

        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        })
    } catch (e) {
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '' // date
        })
    }
}

const handleUpdateUser = async (req, res) => {
    try {

        let data = await userService.updateUser(req.body)

        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        })

    } catch (e) {
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '' // date
        })
    }
}

const handleDeleteUser = async (req, res) => {
    try {

        if (!req.body.id) {
            return res.status(200).json({
                EM: 'Missing required parameter',
                EC: 1,
                DT: ''
            })
        }

        let data = await userService.deleteUser(req.body.id)

        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        })

    } catch (e) {
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '' // date
        })
    }
}

const getAllCode = async (req, res) => {
    try {
        let data = await userService.getAllCodeService(req.query.type);

        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        })
    } catch(e) {
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '' // date
        })
    }
}

module.exports = {
    handleLogin,
    handleGetAllUser,
    handleCReateNewUser,
    handleUpdateUser,
    handleDeleteUser,
    getAllCode
}