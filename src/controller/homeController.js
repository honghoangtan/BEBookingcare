
import db from '../models/index'

import CRUDService from '../service/CRUDService'

let getHomePage = async (req, res) => {

    try {
        let data = await db.User.findAll()

        return res.render('homePages.ejs', {
            data: JSON.stringify(data)
        })
    } catch(e) {
        console.log(e)
    }

}

const getAboutPage = () => {

}


let postCRUD = async (req, res) => {
    // await CRUDService.createNewUser(req.body)
    let data = await CRUDService.createNewUser(req.body)

    console.log(data)

    return res.send('post CRUD from sẻver')
}


const getCRUD = (req, res) => {
    return res.render('crud.ejs')
}

const displayGetCRUD = async (req, res) => {

    let data = await CRUDService.getAllUser()
    
    console.log('-------------------')
    console.log(data)
    return res.render('displayCRUD.ejs', {
        dataTable: data
    })
}

let editCRUD = async (req, res) => {

    let userId = req.query.id

    if (userId) {

        let userData = await CRUDService.getUserInfoById(userId)
        return res.render('editCRUD.ejs', {
            user: userData
        })
    }
    

}

let putCRUD = async (req, res) => {
    let data = req.body
    console.log('------putCRUD', data)
    let firstName = data.firsname
    let lastName = data.lastname
    let address = data.address
    let id = data.id
    let allUser = await CRUDService.updateUser(firstName, lastName, address, id)

    return res.render('displayCRUD.ejs', {
        dataTable: allUser
    })
}

let deleteCRUD = async (req, res) => {
    let id = req.query.id
    
    if (id) {
        await CRUDService.deleteUserById(id)
        return res.send('DELETE user success')

    }


}

module.exports = {
    getHomePage,
    postCRUD,
    getAboutPage,
    getCRUD,
    displayGetCRUD,
    editCRUD,
    deleteCRUD,
    putCRUD
}