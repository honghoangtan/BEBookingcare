import db from '../models/index'

require('dotenv').config

import _ from 'lodash'

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE

import emailService from '../service/emailService'


const getTopDoctorHome = async (limitInput) => {
    
    console.log("------------------------")
    console.log("RUN CODE GETDOCTOR")
    try {

        console.log("------------------------")
        console.log("RUN CODE IN TRY")
        
        let users = await db.User.findAll({
            where: {
                roleId: 'R2'
            },
            attributes: {
                exclude: ['password']
            },
            limit: limitInput,
            order: [
                ['id', 'DESC']
            ],
            include: [
                { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']},
                { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi']}
            ],
            raw: true,
            nest: true
        })

        console.log('>>> CHECK USERS FROM DOCTOR: ', users)

        if (users) {
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

const getAllDoctor = async () => {
    try {

        let doctors = await db.User.findAll({
            where: { roleId: 'R2' },
            attributes: {
                exclude: ['password', 'image']
            }
        })

        if (doctors) {

            console.log(">>> CHECK ALL DOCTOR: ", doctors)
            return {
                EM: 'get data susccess',
                EC: 0,
                DT: doctors
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

const checkRequiredFields = (inputData) => {
    let arrFields = ['id', 'contentHTML', 'contentMarkdown', 'action', 'priceId', 'paymentId', 'provinceId',
                        'nameClinic', 'addressClinic', 'note', 'specialtyId'
                    ]

    let isValid = true;
    let element = ''

    for (let i = 0; i < arrFields.length; i++) {
        if (!inputData[arrFields[i]]) {
            isValid = false
            element = arrFields[i]
            break
        }
    }

    return {
        isValid: isValid,
        element: element
    }
}

const saveDetailInforDoctor = async (inputData) => {
    try {
        let check = checkRequiredFields(inputData)

        if (check.isValid === false) {
            return {
                EM: `missing parameter ${check.element}`,
                EC: 1,
                DT: []
            }
        } 
        else {

            // upsert to Markdown
            if (inputData.action === 'CREATE') {
                await db.Markdown.create({
                    contentHTML: inputData.contentHTML,
                    contentMarkdown: inputData.contentMarkdown,
                    description: inputData.description,
                    doctorId: inputData.id
                })
            } else if (inputData.action === 'EDIT') {
                let doctorMaskDown = await db.Markdown.findOne({
                    where: { doctorId: inputData.id},
                    raw: false
                })

                if (doctorMaskDown) {
                    doctorMaskDown.contentHTML = inputData.contentHTML,
                    doctorMaskDown.contentMarkdown = inputData.contentMarkdown,
                    doctorMaskDown.description = inputData.description,

                    doctorMaskDown.updateAt = new Date()

                    await doctorMaskDown.save()
                }
            }

            // upsert to Doctor Infor
            let doctorInfor = await db.Doctor_Infor.findOne({
                where: { doctorId: inputData.id},
                raw: false
            })

            if (doctorInfor) {
                // update
                doctorInfor.doctorId = inputData.id,
                doctorInfor.priceId = inputData.priceId,
                doctorInfor.provinceId = inputData.provinceId,
                doctorInfor.paymentId = inputData.paymentId
                doctorInfor.addressClinic = inputData.addressClinic
                doctorInfor.nameClinic = inputData.nameClinic
                doctorInfor.note = inputData.note
                doctorInfor.specialtyId = inputData.specialtyId
                doctorInfor.clinicId = inputData.clinicId

                await doctorInfor.save()

            } else {
                // create
                await db.Doctor_Infor.create({
                    doctorId: inputData.id,
                    priceId: inputData.priceId,
                    provinceId: inputData.provinceId,
                    paymentId: inputData.paymentId,
                    addressClinic: inputData.addressClinic,
                    nameClinic: inputData.nameClinic,
                    note: inputData.note,
                    specialtyId: inputData.specialtyId,
                    clinicId: inputData.clinicId
                })
            }

            return {
                EM: 'Save infor doctor success',
                EC: 0,
                DT: []
            }
        }


    } catch  (e) {
        return {
            EM: 'Something wrongs in service...',
            EC: -2,
            DT: []
        }
    }
}

const getDetailDoctorById = async (id) => {
    try {

        if (id) {
            
            let detailDoctor = await db.User.findOne({
                where: { id: id },
                attributes: {
                    exclude: ['password']
                },

                include: [
                    { model: db.Markdown},
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']},

                    { 
                        model: db.Doctor_Infor,
                        include: [
                            { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi']},
                            { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi']},
                            { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi']}
                        ]
                    },
                ],
                raw: true,
                nest: true
            })

            if (detailDoctor) {

                if (detailDoctor.image) {
                    detailDoctor.image = new Buffer(detailDoctor.image, 'base64').toString('binary')
                }

                return {
                    EM: 'get data susccess',
                    EC: 0,
                    DT: detailDoctor
                }

            } else {
                return {
                    EM: 'get data error',
                    EC: 0,
                    DT: []
                }
            }

        } else {
            return {
                EM: 'missing required parameter!',
                EC: 1,
                DT: []
            }
        }

    } catch (e) {
        return {
            EM: 'Something wrongs in service...',
            EC: -2,
            DT: []
        }
    }
}

const bulkCreateSchedule = async (data) => {
    try {
        if (!data.arrSchedule || !data.doctorId || !data.formatedDate) {
            return {
                EM: 'missing parameter',
                EC: 1,
                DT: []
            }
        } else {
            let schedule = data.arrSchedule

            if (schedule && schedule.length > 0) {
                schedule = schedule.map(item => {
                    item.maxNumber = MAX_NUMBER_SCHEDULE
                    return item
                })
            }

            // get all existingdata
            let existing = await db.Schedule.findAll({
                where: { doctorId: data.doctorId, date: data.formatedDate},
                attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                raw: true
            })

            // compare different

            let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                return a.timeType === b.timeType && +a.date === +b.date
            })

            // create data
            if (toCreate && toCreate.length > 0) {
                console.log(">>>> CREATED SCHEDULE:<<<<<<<<<<<<<<<<")
                await db.Schedule.bulkCreate(toCreate);
            }
            
            
            return {
                EM: 'Create schedule success',
                EC: 0,
                DT: ''
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

const getScheduleByDate = async (doctorId, date) => {
    try {

        if (!doctorId || !date) {
            return {
                EM: 'missing required parameter',
                EC: 1,
                DT: []
            }
        } else {
            let data = await db.Schedule.findAll({
                where: { doctorId: doctorId, date: date},
                include: [
                    {
                        model: db.Allcode, as: 'timeTypeData', attributes: ['valueVi', 'valueEn']
                    },
                    {
                        model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName']
                    }
                ],
                raw: false,
                nest: true
            })
            
            console.log("---------------------------------")
            console.log(">>> CHECK DATA DOCTOR: ", data)

            if (!data) {
                data = []
            }

            return {
                EM: 'Get data success',
                EC: 0,
                DT: data
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

const getExtraInforDocorById = async (doctorId) => {
    try {

        if (!doctorId) {
            return {
                EM: 'missing required parameter',
                EC: 1,
                DT: []
            }
        } else {
            let data = await db.Doctor_Infor.findOne({
                where: { doctorId: doctorId },
                attributes: {
                    exclude: ['id']
                },
                include: [
                    {
                        model: db.Allcode, as: 'priceData', attributes: ['valueVi', 'valueEn']
                    },
                    {
                        model: db.Allcode, as: 'provinceData', attributes: ['valueVi', 'valueEn']
                    },
                    {
                        model: db.Allcode, as: 'paymentData', attributes: ['valueVi', 'valueEn']
                    }
                ],
                
                raw: false,
                nest: true
            })

            if (!data) {
                // Vì lấy ra 1 thằng người dùng nên nó phải là 1 object
                return {
                    EM: 'Get data success',
                    EC: 0,
                    DT: {}
                }
            }

            return {
                EM: 'Get data success',
                EC: 0,
                DT: data
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

const getProfileDoctorById = async (doctorId) => {
    try {

        if (!doctorId) {
            return {
                EM: 'missing required parameter',
                EC: 1,
                DT: []
            }
        } else {
            let detailDoctor = await db.User.findOne({
                where: { id: doctorId },
                attributes: {
                    exclude: ['password']
                },

                include: [
                    { model: db.Markdown},

                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']},

                    { 
                        model: db.Doctor_Infor,
                        include: [
                            { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi']},
                            { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi']},
                            { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi']}
                        ]
                    },
                ],
                raw: true,
                nest: true
            })

            if (!detailDoctor) {
                return {
                    EM: 'get data error',
                    EC: 0,
                    DT: []
                }
            } else {
                if (detailDoctor.image) {
                    detailDoctor.image = new Buffer(detailDoctor.image, 'base64').toString('binary')
                }

            }
            
            return {
                EM: 'get data susccess',
                EC: 0,
                DT: detailDoctor
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

const getListPatientForDoctor = async (doctorId, date) => {
    try {

        if (!doctorId || !date) {
            return {
                EM: 'missing required parameter',
                EC: 1,
                DT: []
            }
        } else {
            let detailDoctor = await db.Booking.findAll({
                where: { 
                    docterId: doctorId, 
                    date: date,
                    statusId: 'S2'
                },

                include: [

                    { 
                        model: db.User, 
                        as: 'patientData', 
                        attributes: ['email', 'firstName', 'address', 'gender'],

                        include: [
                            { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi']},
                        ]
                    },

                    { 
                        model: db.Allcode, 
                        as: 'DataTime', 
                        attributes: ['valueEn', 'valueVi'],
                    },
                ],
                raw: true,
                nest: true
            })

            if (!detailDoctor) {
                return {
                    EM: 'get data error',
                    EC: 0,
                    DT: []
                }
            }
            
            return {
                EM: 'get data susccess',
                EC: 0,
                DT: detailDoctor
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

const sendRemery = async (data) => {
    try {

        console.log('----------')
        console.log(data)

        if (!data.email || !data.doctorId || !data.patientId || !data.timeType) {
            return {
                EM: 'missing required parameter',
                EC: 1,
                DT: []
            }
        } else {
            // update patient status
            let appoinment = await db.Booking.findOne({
                where: {
                    patientId: data.patientId,
                    docterId: data.doctorId,
                    timeType: data.timeType,
                    statusId: 'S2'
                },
                raw: false
            })

            if (appoinment) {
                appoinment.statusId = 'S3'
                await appoinment.save()
            }

            //send email
            await emailService.sendAttachment(data)

            return {
                EM: 'Update success',
                EC: 0,
                DT: appoinment
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

module.exports = {
    getTopDoctorHome,
    getAllDoctor,
    saveDetailInforDoctor,
    getDetailDoctorById,
    bulkCreateSchedule,
    getScheduleByDate,
    getExtraInforDocorById,
    getProfileDoctorById,
    getListPatientForDoctor,
    sendRemery
}