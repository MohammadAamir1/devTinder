# DevTinder APIs

## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRouter
- POST /request/send/interest/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId


## userRouter
- GET /user/connection
- GET /user/requests/received
- GET /user/feed - gets you the profile

status: ignore, interested, accepted, rejected