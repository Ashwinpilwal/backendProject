# Note:
>   Req.files look like this:
 
  [Object: null prototype] {
    avatar: [
        {
            fieldname: 'avatar',
            originalname: '_arnav_0_9__AQPIRKMClBSmaLWsB4yuoQevTBijZ6aFsBnjQ1VRFG_r1fG5IMcwXLNgUZUlAFXtz1tlOV_uWUF5rXaxiuTHv9Ox.mp4',
            encoding: '7bit',
            mimetype: 'video/mp4',
            destination: 'public/temp',
            filename: '_arnav_0_9__AQPIRKMClBSmaLWsB4yuoQevTBijZ6aFsBnjQ1VRFG_r1fG5IMcwXLNgUZUlAFXtz1tlOV_uWUF5rXaxiuTHv9Ox.mp4',
            path: 'public\\temp\\_arnav_0_9__AQPIRKMClBSmaLWsB4yuoQevTBijZ6aFsBnjQ1VRFG_r1fG5IMcwXLNgUZUlAFXtz1tlOV_uWUF5rXaxiuTHv9Ox.mp4',
            size: 3043823
        }
    ]
  }
>   That's why we do:
    const avatarLocalPath = req.files?.avatar?.[0]?.path 
    const avatar = await uploadOnCloudinary(avatarLocalPath)