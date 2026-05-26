// require('dotenv').config({path: './path'})
import dotenv from 'dotenv'
dotenv.config({
    path: './env'
})
import connectDB from './db/index.js'


connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Servering is Walking on http://localhost:${process.env.PORT}`)
        }) 
    })
    .catch((error) => {
        console.log("MongoDB Connection Fails!")
    })




