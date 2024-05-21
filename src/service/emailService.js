
require('dotenv').config

import nodemailer from 'nodemailer'

let sendSimpleEmail = async (dataSend) => {

    console.log(">>>> CHECK EMAIL FROM PATIENT: ", dataSend.receiversEmail)


    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: process.env.EMAIL_APP,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    try {

        let info = await transporter.sendMail({
            from: '"Draw send email 👻" <hoangtan181201@gmail.com>', // sender address
            to: dataSend.receiversEmail, // list of receivers
            subject: "Thông tin đặt lịch khám bệnh ✔", // Subject line
            text: "Hello world?", // plain text body
            html: getBodyHTMLEmail(dataSend), // html body
          });
    
        console.log(">>>> CHECK SEND EMAIL")
    } catch (e) {
        console.log("CHECK ERROR: ", e)
    }


    
}

let getBodyHTMLEmail = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {

        result =`
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Booking Care</p>
        <p>Thông tin đặt lịch khám bệnh:</p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>

        <p>Nếu các thông tin trên là đúng sự thật, vui lòng click vào đường link bên dưới
            để xác nhận hoàn tất việc đặt lịch khám bệnh.
        </p>

        <div>
            <a href=${dataSend.redirectLink} target="_blank">Click here</a>
        </div>

        <div>Xin chân thành cảm ơn</div>

    `     
    } else if (dataSend.language === 'en') {

        result = `
        <h3>Dear ${dataSend.patientName}!</h3>
        <p>You have received this email because you booked your medical appointment online on Booking Care</p>
        <p>Information for scheduling medical examination:</p>
        <div><b>Time: ${dataSend.time}</b></div>
        <div><b>Doctor: ${dataSend.doctorName}</b></div>

        <p>If the above information is true, please click on the link below
        to confirm completion of medical examination appointment.
        </p>

        <div>
            <a href=${dataSend.redirectLink} target="_blank">Click here</a>
        </div>

        <div>Sincerely thank</div>

    `
    }

    return result
}

let sendAttachment = async (dataSend) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: process.env.EMAIL_APP,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    try {

        console.log('-------')
        console.log('EMAIL: ', dataSend.email)

        const info = await transporter.sendMail({
            from: '"Draw send email 👻" <hoangtan181201@gmail.com>', // sender address
            to: dataSend.email, // list of receivers
            subject: "Thông tin đặt lịch khám bệnh ✔", // Subject line
            text: "Hello world?", // plain text body
            html: getBodyHTMLEmailRemeDy(dataSend), // html body
            attachments: [
                {
                    filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                    content: dataSend.imgBase64.split("base64,")[1],
                    encoding: 'base64'
                }
            ]
          });
    
    } catch (e) {
        console.log("CHECK ERROR: ", e)
    }
}

const getBodyHTMLEmailRemeDy = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {

        result =`
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Booking Care</p>
        <p>Thông tin đơn thuốc/hóa đơn được gửi trong file đính kèm.</p>

        <div>Xin chân thành cảm ơn</div>

    `     
    } else if (dataSend.language === 'en') {

        result = `
        <h3>Dear name ${dataSend.patientName}!</h3>
        <p>You have received this email because you booked your medical appointment online on Booking Care</p>

        <div>Sincerely thank</div>

    `
    }

    return result
}

module.exports = {
    sendSimpleEmail,
    sendAttachment
}