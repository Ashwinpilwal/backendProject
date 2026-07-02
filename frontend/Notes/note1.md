# Why using Axios over traditional fetch

> Why do most React projects use Axios?
1. Automatic JSON conversion

With fetch, you write:
body: JSON.stringify(data)

With Axios: axios.post(url, data);
Axios converts it for you.

2. Easier error handling

fetch doesn't throw an error for 404 or 401.

You have to check:

if (!response.ok) {
    throw new Error();
}
Axios automatically throws an error if the response status is outside the 2xx range.

3. Better request/response handling

You can add things like authentication or logging in one place instead of every request. This is especially useful in larger apps.


>So why create an Axios instance?

Imagine you don't.

Every request looks like:

axios.post(
    "http://localhost:8000/api/v1/users/login",
    data,
    {
        withCredentials: true
    }
);

axios.get(
    "http://localhost:8000/api/v1/users/current-user",
    {
        withCredentials: true
    }
);i

Notice how you're repeating:

http://localhost:8000/api/v1
withCredentials: true

over and over.