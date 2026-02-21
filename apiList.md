# DevTinder APIs

## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile
- PATCH /profile/edit
- PATCH /profile/password  // forgot password API

## connectionRequestRouter
- POST /request/send/:status/:userId
- POST /request/review/:status/:requestId

- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId


## userRouter
- GET /user/requests/received
- GET /user/connection
- GET /user/feed - gets you the profile

status: ignore, interested, accepted, rejected