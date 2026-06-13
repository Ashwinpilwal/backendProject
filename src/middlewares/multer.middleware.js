import multer from "multer";

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, '/public/temp')
    },
    filename: function(req, file, cb){
        
        cb.apply(null, file.fieldname)
        console.log(file.filename)
    }
})

export const upload = multer({storage: storage})