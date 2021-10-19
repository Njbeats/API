const mongoose = require('mongoose');
const User = require('../models/user');

module.exports = {
   
     getAll: (req, res, next) => {
        User.find()
        .select()
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                users: docs.map(doc => {
                    return {
                        _id: doc._id, 
                        email: doc.email,
                        password: doc.password,
                        userType: doc.userType,
                        isAdmin: doc.isAdmin,
                        isActive: doc.isActive,    
                        isEmailVerified: doc.isEmailVerified,
                        profile: doc.profile,
                        request: {
                            type: "Get",
                            url: "http://localhost:8080/users/" + doc._id
                        }
                    };
                })
            };
            if (docs.length >= 0) 
                res.status(200).json(response);
            else res.status(404).json({
                message: 'No entries found',
                request: {
                    name: 'Create an account',
                    request: {
                        type: 'POST',
                        url: "http://localhost:8080/users"
                    }
                }
            });
            
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    }, 

    getOne:  (upload, req, res, next) => {
        const id = req.params.userId;
        User.findById(id)
        .select()
        .exec()
        .then(
            doc => {
                if(doc) {
                    res.status(200).json({
                        product: doc,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:8080/users/' + doc._id
                        }
                    });
                } else {
                    res.status(404).json({
                        message: "No user with provided user ID",
                    });
                }
            }
        )
        .catch(
            err => {
                console.log(err);
                res.status(500).json({
                    error: err,
                    errorString: `${err}`,
                })
            }
        );
    },

    createOne: (req, res, next) => {
        const user  = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: req.body.password,
            userType: req.body.userType,
            isAdmin: req.body.isAdmin,
            isActive: req.body.isActive,    
            isEmailVerified: req.body.isEmailVerified,
            profile: req.body.profile,
        });

        user.password = user.encryptPassword(req.body.password);

        user.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "User Created successfully",
                createdUser: {
                    _id: result._id,
                    email: result.email,
                    password: result.password,
                    userType: result.userType,
                    isAdmin: result.isAdmin,
                    isActive: result.isActive,    
                    isEmailVerified: result.isEmailVerified,
                    profile: result.profile,
                    request: {
                        type: 'GET',
                        url: "http://localhost:8080/users/" + result._id
                    }
                }
            });
        }).catch(err => {
            //console.log(err);
            res.status(500).json({
                error: err,
                errorString: `${err}`,
            })
        })
         
    },   

    deleteOne: (req, res, next) => { 
        const id = req.params.userId;
        User.findOneAndDelete({_id: id})
        .exec()
        .then( result => {
            if (!result) return res.status(404).json({ message: `No user with id: ${id} found!` });
            res.status(200).json({
                message: `${result.title} was delete Successfully`
            });
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err,
                errorString: `${err}`,
            });
        })
    },

    updateOne: function (req, res, next) {
        if (JSON.stringify(req.body) == "{}") return res.status(404).json({message: 'Empty update Parameters'});  
        const id = req.params.userId;

        User.findByIdAndUpdate({_id: id}, { $set: req.body}, {new: true})
        .exec()
        .then(
            result => { 
                if(!result || result.length === 0) return res.status(404).json({ message: `No user with id: ${id} exits`});
                
                let userUpdate = JSON.parse(JSON.stringify(result));
                ['equipment', 'createdAt', 'updatedAt', '__v'].forEach(e => delete userUpdate[e]);
                
                res.status(200).json(userUpdate);
            }
        )
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
                errorString: `${err}`
            })
        });     

        // User.findOne({ title: req.params.title}, 
        //     function (err, user) {
        //         if (err) return res.status(400).json(err);
        //         if(!user) return res.status(404).json({ message: ` Sorry, no Record titled: ${req.params.title} found!`});
        //         let user_a = JSON.parse(JSON.stringify(user._doc));
        //         let user_b = JSON.parse(JSON.stringify(user._doc));

        //         // console.log("********************  Start User A****************");
        //         // console.log(user_a);
        //         // console.log("********************  END User A****************");

        //         // console.log("********************  Start User B****************");
        //         // console.log(user_b);
        //         // console.log("********************  END User B****************");

        //         if(req.body.title) user_b.title = req.body.title;
        //         if(req.body.wired_desktop_mics) user_b.details.wired_desktop_mics = parseInt(req.body.wired_desktop_mics);
        //         if(req.body.cordless_mics) user_b.details.cordless_mics = parseInt(req.body.cordless_mics);
        //         if(req.body.wired_desktop_mics_min) user_b.details.wired_desktop_mics_min = parseInt(req.body.wired_desktop_mics_min);
        //         if(req.body.wired_desktop_mics_max) user_b.details.wired_desktop_mics_max = parseInt(req.body.wired_desktop_mics_max);
        //         if(req.body.cordless_mics) user_b.details.cordless_mics = parseInt(req.body.cordless_mics);
        //         if(req.body.speakers_min) user_b.details.speakers_min = parseInt(req.body.speakers_min);
        //         if(req.body.speakers_max) user_b.details.speakers_max = parseInt(req.body.speakers_max);
        //         if(req.body.price) user_b.price = parseInt(req.body.price);
        //         if(req.body.description) user_b.description = req.body.description;
        //         console.log(JSON.stringify(user_b));

        //         // console.log("********************  AA Start User A****************");
        //         // console.log(JSON.parse(JSON.stringify(user_a)));
        //         // console.log("********************  END User A****************");
        //         // console.log("********************  BB Start User B****************");
        //         // console.log(JSON.parse(JSON.stringify(user_b)));
        //         // console.log("********************  END User B****************");
        //         // console.log("*** User a === User b*************");
        //         // console.log(JSON.parse(JSON.stringify(user_b)) == JSON.parse(JSON.stringify(user_b)));

        //         Object.keys(user_b).forEach((key, value) => {
        //             // console.log('Key: ' + key);
        //             //console.log(key );
                    
        //             if(key == 'details') {
        //                 Object.keys(user_b.details).forEach((k, v) => {
        //                     console.log(user_b.details[k] == user_a.details[k], user_b.details[k], user_a.details[k]);
        //                    if ( user_b.details[k] == user_a.details[k]) delete user_b.details[k]
        //                 });
        //             }
        //             if ( user_b[key] == user_a[key]) delete user_b[key];                        
        //             //console.log(user_a[key] == user_b[key] );

        //         });            
        //         //console.log(user_b);

        //         User.updateOne({ title: req.params.title }, {$set: JSON.stringify(user_b)}, {new: true}, function (err, user){
        //             if (err) console.log(err);
        //             if (err) return res.status(400).json(err);
        //             if (!user) return res.status(404).json({ message: ` Sorry, no Record titled: ${req.params.title} found!`});
        //             res.json(user);
        //         });
        //     });
    
    }, 

    

};