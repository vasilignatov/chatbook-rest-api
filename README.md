# e-commerce-rest-api
This project is REST-API server build for **[e-commerce-react-app](https://github.com/vasilignatov/e-commerce-react-app)** SPA.\
The project is built on the basis of **[express-boilerplate](https://github.com/vasilignatov/express-boilerplate)** 

## Endpoints

Available routes:

**Auth routes**\
`POST /auth/register` - Register route\
`POST /auth/login` - Login route\
`POST /auth/logout` - Logout route (Auth restriction)\
`POST /auth/refresh-token` - Refresh token route

**User routes**\
`GET /users/` - Get all users (Admin restriction)\
`POST /users/` - Create user (Admin restriction)\
`DELETE /users/suggestions` - Get suggestion (Auth restriction)
`GET /users/:userId` - Get user (Auth restriction)\
`PUT /users/:userId` - Update route (Owner restriction)\
`DELETE /users/:userId` - Delete route (Owner restriction)

**Chat routes**\
`GET /chat/` - Get recent chat (Auth restriction)\
`GET /chat/:roomId` - Get chat for room with roomId (Auth restriction)\
`POST /chat/initiate` - Create chat room (Auth restriction)
