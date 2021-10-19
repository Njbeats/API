const mongoose = require ('mongoose');

const reservationSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
        
    madeBy: {
        user: { type: mongoose.Schema.Types.ObjectId, ref:'User' }
    }, 
    date: { type: Date, required: true, },
    dateTimeStart: { type: Date, required: true},
    dateTimeEnd: { type: Date, required: true },
    location: {
        name: { type: String, trim: true },
        locationType: { type: String, trim: true, },
        description: { type: String, trim: true},
    },
    address: {                
        address1: { type: String, trim: true, },
        address2: { type: String, trim: true, },
        city: { type: String, trim: true },
        province: { type: String, trim: true, },
        country: { type: String, trim: true, },
        postal_code: { type: String, trim: true, }
    },
    description: { type: String, },
    special_requiment: { type: String, },
    package: { type: mongoose.Schema.ObjectId, ref: 'equipment' },
    additional_services: { type: String, trim: true },
    timeMade: { type: Date, default: Date.now() },
}, {timestamps: true});

module.exports = mongoose.model('Reservation', reservationSchema);
