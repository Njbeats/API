const mongoose = require ('mongoose');

const organisationSchema = new mongoose.Schema({
       
    title: { type: String, unique: true, trim: true, required: true },
    name_abrv: { type: String, trim: true },

    logo: { type: String },

    contact: {
        url: { type: String, trim: true, },

        tel: { type: String, match: [/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g] },
        
        email: [{ type: String, trim: true, lowercase: true,
            match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, `Please fill valid email address`],
            validate: {
                validator: (v) => {
                    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
                },
                message: "Please enter a valid email"
            },
        }]

    },    

    classification: { type: String,
        enum: ['NGO', 'Non-Governmental Organisation', 'Hotel', 'Lodge', 'Parastetal', 'Government Ministry', 'Donor Agency', 'Statutory Body', 'Business Associations', 'Diplomatic Mission', 'Embassy', 'Limited', 'LTD' ] 
    },

    description: { type: String, maxlength: 500 },

    address: {  
        address1: { type: String, trim: true },
        address2: { type: String, trim: true },
        city: { type: String, trim: true },
        province: { type: String, trim: true },
        country: {  type: String, trim: true },
        postal_code: { type: Number, trim: true },
    },

    contactPerson: [{ type: mongoose.Schema.ObjectId, ref: 'Profile' }]
},
  { timestamps: true });
module.exports = mongoose.model('Organisation', organisationSchema);
