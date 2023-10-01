const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = {
    development: {
        PORT: 3100,
        MONGODB_URL: 'mongodb://127.0.0.1:27017/messanger-clone-rest-api',
        JWT_SECRET: '88819a11e0d24153de4fbe9c0b9d3206ea3ac16905bd6b44b7b6d11fc0863751a1ca4467ade1ff42fce5d0ecd7474d2913209127ccbc09356fde662b91f40360',
        SALT_ROUNDS: 1,
        JWT_ACCESS_EXPIRATION_MINUTES: 30,
        JWT_REFRESH_EXPIRATION_DAYS: 30,
        IMAGE_KIT_PUBLIC_KEY: 'public_BrrOwcySJsmMwiYPn7AABrM8mW8=',
        IMAGE_KIT_PRIVATE_KEY: 'private_OmFmuN+//tGgoRoYri2GfBI7gfI=',
        IMAGE_KIT_ENDPOINT: "https://ik.imagekit.io/8brpz6ecl"
    },
    production: {
        PORT: process.env.PORT,
        MONGODB_URL: process.env.MONGODB_URL,
        SALT_ROUNDS: process.env.SALT_ROUNDS,
        JWT_SECRET: process.env.JWT_SECRET,
        JWT_ACCESS_EXPIRATION_MINUTES: process.env.JWT_ACCESS_EXPIRATION_MINUTES,
        JWT_REFRESH_EXPIRATION_DAYS: process.env.JWT_REFRESH_EXPIRATION_DAYS,
        IMAGE_KIT_PUBLIC_KEY: process.env.IMAGE_KIT_PUBLIC_KEY,
        IMAGE_KIT_PRIVATE_KEY:process.env.IMAGE_KIT_PRIVATE_KEY,
        IMAGE_KIT_ENDPOINT: process.env.IMAGE_KIT_ENDPOINT
    },
    env: process.env.NODE_ENV
}