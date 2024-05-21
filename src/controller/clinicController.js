
import clinicService from '../service/clinicService'

const createNewClinic = async (req, res) => {
    try {

        let data = await clinicService.createNewClinic(req.body)

        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        })

    } catch (e) {
        console.log(e)
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '' // date
        })
    }
}

const getClinic = async (req, res) => {
    try {

        let data = await clinicService.getClinic()

        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        })

    } catch (e) {
        console.log(e)
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '' // date
        })
    }
}

const getDetailClinicById = async (req, res) => {
    try {

        let data = await clinicService.getDetailClinicById(req.query.clinicId)

        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        })

    } catch (e) {
        console.log(e)
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '' // date
        })
    }
}

module.exports = {
    createNewClinic,
    getClinic,
    getDetailClinicById
}