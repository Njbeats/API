const mongoose = require ('mongoose');

const bookingSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    
    user: { type: mongoose.Schema.Types.ObjectId, ref:'User'},

    reservation: [{
        date: { type: Date, required: true, },
        dateTimeStart: { type: Date,},
        dateTimeEnd: { type: Date, },
        location: {
            address1: { type: String, trim: true,  required: [true, 'Position is required'] },
            address2: { type: String, trim: true,  required: [true, 'Position is required'] },
            city: { type: String, trim: true, required: [true, 'Position is required']},
            province: { type: String, trim: true, required: [true, 'Position is required'] },
            country: { type: String, trim: true, required: [true, 'Position is required'] },
            postal_code: { type: String, trim: true, required: [true, 'Position is required'] }
        },
        description: { type: String },
        special_requiment: { type: String, },
        package: [{ type: mongoose.Schema.ObjectId, ref: 'equipment' }],
        other_services: [{
            service: { type: String },
            description: { type: String,}
        }],
    }], 

}, {timestamps: true});
module.exports = mongoose.model('Booking', bookingSchema);
