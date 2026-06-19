# Note:
1. Aggregation Pipeline code directly goes to MongoDB, because don't do work in pipeline.

>   That why we do:
    _id = new mongoose.Types.ObjectId(req.user._id )

    instead of: _id = req.user._id

2. $lookup: {
        from: "video",
    ...}
    > means kahan se lookup karna ha,  


# getWatchHistory returneddummy data: 

{
    _id: ObjectId("u1"),
    username: "ashwin",

    watchHistory: [
        {
            _id: ObjectId("v1"),
            title: "NodeJS Tutorial",

            owner: [
                {
                    fullName: "Hitesh",
                    username: "chaiaurcode",
                    avatar: "avatar.jpg"
                }
            ]
        },

        {
            _id: ObjectId("v2"),
            title: "MongoDB Tutorial",

            owner: [
                {
                    fullName: "Piyush",
                    username: "piyush",
                    avatar: "avatar2.jpg"
                }
            ]
        }
    ]
}