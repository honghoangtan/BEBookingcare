
import specialtyService from '../service/specialtyService'

const createNewSpecialty = async (req, res) => {
    try {

        let data = await specialtyService.createNewSpecialty(req.body)

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

const getSpecialty = async (req, res) => {
    try {

        let limit = req.query.limit

        if (!limit) {
            limit = 5
        }

        let data = await specialtyService.getSpecialty(+limit)

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

const getDoctorInSpecialty = async (req, res) => {
    try {

        let data = await specialtyService.getDoctorInSpecialty(req.query.specialtyId, req.query.location)

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
    createNewSpecialty,
    getSpecialty,
    getDoctorInSpecialty
}