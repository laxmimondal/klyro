import { EmailAddress } from "@clerk/nextjs/dist/types/server";
import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return EmailAddress.isValid(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    imageUrl: {
        type: String,
        required: true,
    },
    cartItems: {
        type: Object,
        default: {}
    }
}, { minimize: false })

const User = mongoose.models.user || mongoose.model('user', userSchema)

export default User
