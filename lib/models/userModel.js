import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["user", "author"],
        default: "user"
    },
},
{
    timestamps: true
}
);


const userModel = mongoose.models.User || mongoose.model("User", UserSchema);

export default userModel;