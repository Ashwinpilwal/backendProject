# Why wrap with asyncHandler in the first place?
Because async route functions can throw errors, and Express doesn’t always catch them automatically.

const asyncHandler = (fn) => {
    return (req, res) => {
        try{

        }catch(error){
            console.log(error)
        }
    }
}


# Custom Error Class
>   1. Why make a custom error class?

JavaScript already has: throw new Error("Something went wrong")

But normal Error only gives basic info:

1. message
2. name
3. stack

In backend/API we usually need more:

HTTP status code (404, 500)
success status
extra validation errors
consistent response format

That's why me make Custom Class.

>   2. class ApiError extends Error

Means: “Create my custom error using JavaScript’s built-in Error as base.”


>   3. Why super(message)?

Its' like “pass the message to parent Error so it can set itself up.”

super("wrong message")
this.message = "new message" -----> We can do this, only after super(...)

    # Why this.message only after super(message)?
    >   Because before super() there is no "this" yet.
        Parent Error must get first chance to create the object.

        This line: super(message)

        runs parent constructor: Error(message)

        Parent creates: this
        and adds: message, stack, name

        Now object exists. Now you can write this.message




# videoSchema.plugin(mongooseAggregatePaginate), what is this shit?

>   Simple meaning: 👉 “Attach the aggregate pagination feature to this schema.”

    So after this, your Video model gets extra powers.

    Example:

        Without plugin:

            const videos = await Video.aggregate([
            { $match: { isPublished: true } }
            ])

            This gives all results.

        With plugin:

            const videos = await Video.aggregatePaginate(
            Video.aggregate([
                { $match: { isPublished: true } }
            ]),
            {
                page: 1,
                limit: 10
            }
            )

            Now you get:

            {
                docs: [...10 videos],
                totalDocs: 50,
                page: 1,
                totalPages: 5
            }


# userSchema.pre("save", ...), userSchema.methods.isPasswordCorrect = ..., why schema, not model?

>   Answer: Because model is made from schema.

    First: const userSchema = new mongoose.Schema({...})

    Then add extra things:  userSchema.pre(...)
                            userSchema.methods...

    Then create model: const User = mongoose.model("User", userSchema)

    Now User gets all of that.