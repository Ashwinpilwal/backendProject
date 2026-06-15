# Notice I also changed:

>   req.files?.coverImage[0]?.path ---> req.files?.coverImage?.[0]?.path

    Why?

    Suppose the user does not upload a cover image.

    Without: ?.[0]

    JavaScript will try to do: undefined[0]

# Note:
>   throw new ApiError(...) or new ApiResponse(...)
    Here we are making new object everytime we write new.
    