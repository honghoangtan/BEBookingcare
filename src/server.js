import express from 'express'
import bodyParser from 'body-parser'
import viewEngine from './config/viewEngine'
import initWebRoutes from './route/web'
require('dotenv').config()

import connection from './config/connectDB'

import cors from 'cors'

import configCors from "./config/cors";



let app = express()

// config CORS
configCors(app)


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))



//config app
viewEngine(app)
initWebRoutes(app)

connection()


let port = process.env.PORT
app.listen(port, () => {
    console.log('Backend Nodejs is running on the port: ', port)
})