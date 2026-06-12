# Where we save JWT, so that we can verify it?
>   We save JWT in Frontend(At client side in the form of cookie, localstorage, or memory), and avoid saving it in backend.

# Why JWT should not be stored in the backend and only be stored in frontend?
>   If backend stored tokens:
        signIn for 100 users = store 100 tokens
        multiple servers → very hard

# How to verify the JWT token in another file?
    The token comes from the client (frontend → backend)
    The frontend sends the token in headers
    The file (middleware) receives that token
    That file has access to the same secret (process.env.JWT_SECRET)
    It can verify using that secret
    
    Done.