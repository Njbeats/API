const mongoose = require ('mongoose');
const bcrypt = require('bcrypt-nodejs');
const userSchema = new mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,    
    email: { type: String, trim: true, lowercase: true, unique: true, required: [true, 'Email Address is Required'],       
        match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, `Please fill valid email address`],
    },    
    password: { type: String, required: [true, "Password is Required"] },
    userType: { type: String, enum: ['Sales Team', 'Contact Person', 'Admin'], default: 'Sales Team', },
    isAdmin: { type: Boolean, default: false, },
    isActive: { type: Boolean, default: false, },    
    isEmailVerified: { type: Boolean, default: false },
    profile: { type: mongoose.Schema.ObjectId, ref: 'Profile', default: null, }    

}, { timestamps: true });

userSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);
