
import patientService from '../service/patientService'

const postBookAppointment = async (req, res) => {
    try {

        let data = await patientService.postBookAppointment(req.body)

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

const postVerifyBookAppointment = async (req, res) => {
    try {

        let data = await patientService.postVerifyBookAppointment(req.body)

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
    postBookAppointment,
    postVerifyBookAppointment
}