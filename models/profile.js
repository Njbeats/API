const mongoose = require ('mongoose');

const profileSchema = new mongoose.Schema({
      
    title: { type: String, trim: true, required: true, enum: ['Mr', 'Mrs', 'Miss', 'Ms', 'Sir', 'Dr', 'Madam', 'Prof'],},
    firstName:{ type: String, trim: true, required: [true, 'First Name is Required'] },   
    lastName: { type: String, trim: true, required: [true, 'Last Name is Required'] },
    email: { type: String, trim: true, lowercase: true, unique: true, required: [true, 'Email Address is Required'],       
        match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, `Please fill valid email address`],
    },
    phoneNumber: { type: String, trim: true, required: [true, ' Phone Number is Required'],
        match: [/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g], 
    },
    gender: { type: String, trim: true, required: [true, 'Gender is Required'],
        enum: ['Male', 'Female', 'M', 'F'],
    },
    department: { type: String, trim: true, required: [true, 'Department is required'] },    
    position: { type: String, trim: true, required: [true, 'Position is required'] },
    user: { type: mongoose.Schema.ObjectId, ref: 'User', },
    organisation: { title: { type: String },
        id: { type: mongoose.Schema.ObjectId, ref: 'Organisation' }
    }
},
  { timestamps: true });
module.exports = mongoose.model('Profile', profileSchema);
