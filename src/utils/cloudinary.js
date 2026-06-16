import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadOnCloudinary  = async(localFilePath) => {
    try{

        if(!localFilePath) return null;

        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto" //image, video, raw...
        })
        //file has been uploaded successfully...
        console.log("File is successfully on cloudinary... ", response.url)

        fs.unlinkSync(localFilePath) //removing file from local Storage as file successfully uploaded to Cloudinary 
        return response

    }catch(error){
        console.log("Cloudninary error", error)
        fs.unlinkSync(localFilePath) //remove the locally saved temporary file, 
        //as the operation gets failed
        return null
    }
}

// const uploadResult = await cloudinary.uploader
//     .upload(
//         'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//             public_id: 'shoes',
//         }
//     )
//     .catch((error) => {
//         console.log(error);
//     });

export {uploadOnCloudinary}