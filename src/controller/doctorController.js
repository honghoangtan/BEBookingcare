import doctorService from '../service/doctorService'

const getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit

    if (!limit) {
        limit = 4;
    }

    try {
        let data = await doctorService.getTopDoctorHome(+limit)

        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        })
    } catch(e) {
        console.log(e)
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '' // date
        })
    }
}

const getAllDoctor = async (req, res) => {
    try {
        let data = await doctorService.getAllDoctor()

        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        })

    } catch(e) {
        console.log(e)
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '' // date
        })
    }
}

const postInforDoctor = async (req, res) => {
    try {

        let data = await doctorService.saveDetailInforDoctor(req.body)
        
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

const getDetailDoctorById = async (req, res) => {
    try {

        if (!req.query.id) {
            return res.status(200).json({
                EM: 'Missing req.query.id',
                EC: 3,
                DT: ''
            })
        }

        let data = await doctorService.getDetailDoctorById(req.query.id)

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

const bulkCreateSchedule = async (req, res) => {
    try {
        let data = await doctorService.bulkCreateSchedule(req.body)

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

const getScheduleByDate = async (req, res) => {
    try {
        let data = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date)

        console.log(">>> CHECK RETURN FROM SERVICE: ", data)

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

const getExtraInforDocorById = async (req, res) => {
    try {

        let data = await doctorService.getExtraInforDocorById(req.query.doctorId)

        console.log(">>> CHECK RETURN FROM SERVICE: ", data)

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

const getProfileDoctorById = async (req, res) => {
    try {

        let data = await doctorService.getProfileDoctorById(req.query.doctorId)

        console.log(">>> CHECK RETURN FROM SERVICE: ", data)

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

const getListPatientForDoctor = async (req, res) => {
    try {

        console.log(">>> CHECK ID DOCTOR: ", req.query.doctorId)

        let data = await doctorService.getListPatientForDoctor(req.query.doctorId, req.query.date)

        console.log(">>> CHECK RETURN FROM SERVICE: ", data)

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

const sendRemery = async (req, res) => {
    try {
        let data = await doctorService.sendRemery(req.body)

        console.log(">>> CHECK RETURN FROM SERVICE: ", data)

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
    getTopDoctorHome,
    getAllDoctor,
    postInforDoctor,
    getDetailDoctorById,
    bulkCreateSchedule,
    getScheduleByDate,
    getExtraInforDocorById,
    getProfileDoctorById,
    getListPatientForDoctor,
    sendRemery
}