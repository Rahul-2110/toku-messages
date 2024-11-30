import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    username: string;
    password: string;
    comparePassword: (password: string) => Promise<boolean>;
}


export interface IUserDoc extends Model<IUser> { 
    findByUsername: (username: string) => Promise<IUser>;
}


const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
},{
    timestamps: { createdAt: "created_at", updatedAt: "modified_at" },
});

// Pre-save hook to hash password before saving
UserSchema.pre<IUser>('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(this.password, salt);
        this.password = hash;
    }
    next();
});

// Method to check password validity
UserSchema.methods.comparePassword = function(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};


UserSchema.static('findByUsername', async function(username: string): Promise<IUser> {
    const user = await this.findOne({ username });
    return user;
});

const User = mongoose.model<IUser, IUserDoc>('User', UserSchema);
export default User; 