
import db from '../models/index'

const createNewClinic = async (data) => {
    try {

        if (!data.name || !data.image || !data.contentMarkdown || !data.contentHTML || !data.address) {
            return {
                EM: 'missing parameter',
                EC: 1,
                DT: []
            }
        } else {
            await db.Clinic.create({...data})

            return {
                EM: 'create success',
                EC: 0,
                DT: []
            }
        }

    } catch (e) {
        console.log(e)
        return {
            EM: 'Something wrongs in service...',
            EC: -2,
            DT: []
        }
    }
}

const getClinic = async () => {
    try {

        let clinics = await db.Clinic.findAll({
            order: [
                ['id', 'DESC']
            ],
            raw: true
        })

        if (clinics && clinics.length > 0) {
            clinics.map((item) => {
                item.image = new Buffer(item.image, 'base64').toString('binary')
                return item
            })
        }

        return {
            EM: 'get data susccess',
            EC: 0,
            DT: clinics
        }

    } catch (e) {
        console.log(e)
        return {
            EM: 'Something wrongs in service...',
            EC: -2,
            DT: []
        }
    }
}

const getDetailClinicById = async (clinicId) => {
    try {
        if (!clinicId) {
            return {
                EM: 'missing parameter',
                EC: 1,
                DT: []
            }
        } else {
            let data = {}
                data = await db.Clinic.findOne({
                    where: {
                        id: clinicId
                    }, 
                    raw: true
                })

                if (data) {
                    let doctorClinic =[]

                    doctorClinic = await db.Doctor_Infor.findAll({
                        where: {
                            clinicId: clinicId
                        },
                        raw: true
                    })

                    if (doctorClinic) {

                        data.doctorClinic = doctorClinic
                    }

                    return {
                        EM: 'get data susccess',
                        EC: 0,
                        DT: data
                    }
            } else {
                // location

                
            }

        }


    } catch(e) {
        console.log(e)
        return {
            EM: 'Something wrongs in service...',
            EC: -2,
            DT: []
        }
    }
}

module.exports = {
    createNewClinic,
    getClinic,
    getDetailClinicById
}