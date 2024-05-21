import express from 'express'
import homeController from '../controller/homeController'

import userController from '../controller/userController'

import doctorController from '../controller/doctorController'

import patientController from '../controller/patientController'

import specialtyController from '../controller/specialtyController'

import clinicController from '../controller/clinicController'

let router = express.Router()
 
let initWebRoutes = (app) => {

    router.get('/', homeController.getHomePage)
    router.get('/about', homeController.getAboutPage)
    router.get('/crud', homeController.getCRUD)
    router.post('/post-crud', homeController.postCRUD)
    router.get('/get-crud', homeController.displayGetCRUD)
    router.get('/edit-crud', homeController.editCRUD)
    router.post('/put-crud', homeController.putCRUD)
    router.get('/delete-crud', homeController.deleteCRUD)


    router.post('/api/login', userController.handleLogin)
    router.get('/api/get-all-users', userController.handleGetAllUser)
    router.post('/api/create-new-user', userController.handleCReateNewUser)
    router.put('/api/update-user', userController.handleUpdateUser)
    router.delete('/api/delete-user', userController.handleDeleteUser)

    router.get('/api/allcode', userController.getAllCode)

    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome)
    router.get('/api/get-all-doctor', doctorController.getAllDoctor)
    router.post('/api/save-infor-doctor', doctorController.postInforDoctor)
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById)
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule)
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate)
    // Api này dành cho thằng extraInfor là con của thằng DetailDoctor
    router.get('/api/get-exrea-infor-doctor-by-id', doctorController.getExtraInforDocorById)

    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById)

    // get patient booking
    router.get('/api/get-list-patient-for-doctor', doctorController.getListPatientForDoctor)

    router.post('/api/send-remery', doctorController.sendRemery)



    // patient
    router.post('/api/patient-book-appointment', patientController.postBookAppointment)
    router.post('/api/verify-book-appointment', patientController.postVerifyBookAppointment)

    router.post('/api/create-new-specialty', specialtyController.createNewSpecialty)
    router.get('/api/get-specialty', specialtyController.getSpecialty)

    //get doctor in one specialty
    router.get('/api/get-doctor-in-specialty', specialtyController.getDoctorInSpecialty)


    //create clinic
    router.post('/api/create-new-clinic', clinicController.createNewClinic)
    router.get('/api/get-clinic', clinicController.getClinic)
    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById)






    return app.use('/', router)
}
module.exports = initWebRoutes