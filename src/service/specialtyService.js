
import db from '../models/index'


const createNewSpecialty = async (data) => {
    try {

        if (!data.name || !data.image || !data.contentMarkdown || !data.contentHTML) {
            return {
                EM: 'missing parameter',
                EC: 1,
                DT: []
            }
        } else {
            await db.Specialty.create({...data})

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

const getSpecialty = async (limitInput) => {
    try {

        let specialties = await db.Specialty.findAll({
            limit: limitInput,
            order: [
                ['id', 'DESC']
            ],
            raw: true
        })

        if (specialties && specialties.length > 0) {
            specialties.map((item) => {
                item.image = new Buffer(item.image, 'base64').toString('binary')
                return item
            })
        }

        return {
            EM: 'get data susccess',
            EC: 0,
            DT: specialties
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

const getDoctorInSpecialty = async (specialtyId, location) => {
    try {
        if (!specialtyId || !location) {
            return {
                EM: 'missing parameter',
                EC: 1,
                DT: []
            }
        } else {
            let data = {}
                data = await db.Specialty.findOne({
                    where: {
                        id: specialtyId
                    }, 
                    raw: true
                })

                if (data) {
                    let doctorSpecialty =[]

                    if (location === 'ALL') {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId: specialtyId
                            },
                            raw: true
                        })
                    } else {
                        /// find location
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId: specialtyId,
                                provinceId: location
                            },
                            raw: true
                        })
                    }
                    if (doctorSpecialty) {
                        data.doctorSpecialty = doctorSpecialty
                        console.log("-----------------------")
                        console.log(">>>> CHECK DB", data)
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
    createNewSpecialty,
    getSpecialty,
    getDoctorInSpecialty
}