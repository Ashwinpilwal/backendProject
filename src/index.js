import express from 'express'

// require('dotenv').config({path: './path'})
import dotenv from 'dotenv'
dotenv.config({
    path: './env'
})


const app = express()

import connectDB from './db/index.js'
connectDB()














/*
// This is called IIFE
(async() => {

    try{
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        // app.on("ERROR", (error) =>{
        //    console.log("Application not been able to connect with database")
        // })
        app.listen(process.env.POST , () => console.log("App is listening..."))

    }
    catch(error){
        console.log("There is some error While Connecting DB", error)
    }
    finally{
        console.log("Attempt to Connect Cluster Successfull...")
    }
    
})()

*/