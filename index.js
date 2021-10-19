const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');


// Require All Routers
const users = require('./routers/user');
const reservations = require('./routers/reservation');
const bookings = require('./routers/booking');
const equipments = require('./routers/equipment');
const organisations = require('./routers/organisation');
const packages = require('./routers/package');
const profiles = require('./routers/profile');

mongoose.connect('mongodb://localhost:27017/abmcOnline', function (err) {
    if(err) {
        return console.log('Mongoose - Connection Error: ', err);
    }
    console.log('Mongo DB connection Successfully');
});

mongoose.set('runValidators', true);

const app = express();


// Morgan
app.use(morgan('dev'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Orgin', '*');
    res.header('Access-Control-Allow-Orgin-Headers', 'Orgin, X-Requesteed-With, Content-Type, Accept, Authorization');

if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT', 'POST', 'DELETE', 'GET');
    return res.status(200).json({});
}
next();
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Action Group API listening at http://localhost:${port}`);
});




// Configuration EndPoints 

// User RESTFUL Endpoints
app.get('/users', users.getAll);
app.post('/users', users.createOne);
app.get('/users/:userId', users.getOne);
app.put('/users/:userId', users.updateOne);
app.delete('/users/:userId', users.deleteOne);

// Reservation RESTFUL Endpoints
app.get('/reservations', reservations.getAll);
app.post('/reservations/', reservations.createOne);
app.get('/reservations/:reservationId', reservations.getOne);
app.put('/reservations/:reservationId', reservations.updateOne);
app.delete('/reservations/:reservationId', reservations.deleteOne);

// Booking RESTFul Endpoints 
app.get('/bookings', bookings.getAll);
app.post('/bookings/:id/reservation', bookings.createOne);
app.get('/bookings/:id', bookings.getOne);
app.put('/bookings/:id', bookings.updateOne);

// Equipment RESTFul Endpoints
app.get('/equipments', equipments.getAll);
app.post('/equipments', equipments.createOne);
app.get('/equipments/:id', equipments.getOne);
app.put('/equipments/:id', equipments.updateOne);

//Organisation RESTFul Endpoints
app.get('/organisations', organisations.getAll);
app.post('/organisations', organisations.createOne);
app.get('/organisations/:organisationId', organisations.getOne);
app.delete('/organisations/:organisationId', organisations.deleteOne);
app.put('/organisations/:organisationId', organisations.updateOne);

//Packages RESTFul Endpoints
app.get('/packages', packages.getAll);
app.post('/packages', packages.createOne);
app.get('/packages/:packageId', packages.getOne);
app.delete('/packages/:packageId', packages.deleteOne); 
app.put('/packages/:packageId', packages.updateOne); // Update a Package by _id

//Profile RESTFul Endpoints
app.get('/profiles', profiles.getAll);
app.post('/profiles', profiles.createOne);
app.get('/profiles/:profileId', profiles.getOne);
app.put('/profiles/:profileId', profiles.updateOne);
app.delete('/profiles/:profileId', profiles.deleteOne);


//error Routing
const errorRouter = require('./routers/error');
app.use(errorRouter);

module.exports = app;