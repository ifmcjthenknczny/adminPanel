import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    lastLogin: Date,
    regTime: Date,
    active: Boolean,
    password: String
});
const User = mongoose.model('User', UserSchema);

export default User;