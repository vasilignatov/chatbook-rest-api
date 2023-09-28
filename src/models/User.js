const mongoose = require('mongoose');
const toJson = require('@meanie/mongoose-to-json');
const bcrypt = require('bcrypt');
const validator = require('validator');
const config = require('../config/config')[process.env.NODE_ENV];

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: true,
        minlength: [2, 'First name must be at least 2 characters long!']
    },
    lastName: {
        type: String,
        trim: true,
        required: true,
        minlength: [2, 'Last name must be at least 2 characters long!']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email');
            }
        },
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: [8, 'Password must be at least 8 characters long'],
        validate(value) {
            if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                throw new Error('Password must contain at least one letter and one number');
            }
        },
    },
    imageUrl: {
        type: String,
        default: "https://ik.imagekit.io/8brpz6ecl/blank-profile-picture.png?updatedAt=1695838190461"
    }
}, { timestamps: true });

userSchema.statics.isEmailTaken = async function (email) {
    const user = await this.findOne({ email });
    return !!user;
}

userSchema.pre('save', function (next) {
    console.log(this.isModified('password'), ' password');
    if (this.isModified('password')) {
        bcrypt.hash(this.password, config.SALT_ROUNDS)
            .then(hash => {

                this.password = hash;
                return next();
            });
    } else {
        next();
    }
});

userSchema.method('validatePassword', function (password) {
    return bcrypt.compare(password, this.password);
});


// userSchema.plugin(toJson);

const User = mongoose.model('User', userSchema);
module.exports = User;