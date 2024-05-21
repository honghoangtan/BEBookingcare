
import db from '../models/index'

require('dotenv').config
import emailService from './emailService'

import { v4 as uuidv4 } from 'uuid'

let buildURLEmail = (doctorId, token) => {

    let result =  `${process.env.REACT_URL}/verify-booking?token=${token}&doctorId=${doctorId}`

    return result

}

const postBookAppointment = async (data) => {
    try {
        console.log("---------------")
        console.log("CHECK POST BOOK APPOINT MENT")
        if (!data.email || !data.doctorId || !data.date || !data.timeType || !data.fullName) {
            return {
                EM: 'missing parameter',
                EC: 1,
                DT: []
            }
        } else {

            
            let token = uuidv4()

            console.log(">>>> CHECK HAS EMAIL: ", data.email)
            
            await emailService.sendSimpleEmail({
                receiversEmail: data.email,
                patientName: data.fullName,
                time: data.timeString,
                doctorName: data.doctorName,
                language: data.language,
                redirectLink: buildURLEmail(data.doctorId, token)

            })

            console.log("---------------")
            console.log("NO MISSING PARAMETER")


            let user = await db.User.findOrCreate({
                where: { email: data.email },
                defaults: {
                  email: data.email,
                  roleId: 'R3',
                  gender: data.gender,
                  address: data.address,
                  phonenumber: data.phonenumber,
                  firstName: data.fullName
                },
                raw: true
              });

            console.log("user: ", user[0])


            if (user && user[0]) {
                await db.Booking.create({
                    statusId: 'S1',
                    patientId: user[0].id,
                    docterId: data.doctorId,
                    date: data.date,
                    timeType: data.timeType,
                    token: token
                })
            }

            return {
                EM: 'Create success',
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

const postVerifyBookAppointment = async (data) => {
    try {

        if (!data.token || !data.doctorId) {
            return {
                EM: 'missing parameter',
                EC: 1,
                DT: []
            }
        } else {
             
            let appointment = await db.Booking.findOne({
                where: { 
                    token: data.token,
                    docterId: data.doctorId,
                    statusId: 'S1'
                },
                // raw: false (Xai update)
                raw: false
            })

            if (appointment) {
                appointment.statusId ='S2'
                await appointment.save()

                return {
                    EM: 'Update appointment success',
                    EC: 0,
                    DT: appointment 
                }
            } else {
                return {
                    EM: 'Appointment hass been activeed or does not exist',
                    EC: 2,
                    DT: appointment 
                }
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
    postBookAppointment,
    postVerifyBookAppointment
}