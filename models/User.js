const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please enter your first name."],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, "Please enter your last name."],
        trim: true,
    },
    city: {
        type: String,
        required: [true, "Please enter your city."],
        trim: true,
    },
    country: {
        type: String,
        required: [true, "Please enter your country."],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Please enter your email."],
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: "Please provide a valid email.",
        },
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 6,
    },
    confirmPassword: {
        type: String,
        required: [true, "Please confirm your password"],
        minlength: 6,
    },
});

UserSchema.pre("save", async function () {
    if (!this.isModified("password") || !this.isModified("confirmPassword"))
        return;

    const salt = await bcrypt.genSalt(16);
    this.password = await bcrypt.hash(this.password, salt);
    this.confirmPassword = this.password;
});

module.exports = mongoose.model("User", UserSchema);
