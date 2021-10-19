

const errorRouter = require('express')();

// default options

// catch 404 and forward to error handler
errorRouter.use(function(req, res, next) {
    //console.log('can not find' + req.url);
    var err = new Error(' ' + req.url  + ' Not Found' );
    err.status = 404;
    next(err);
});




    // error handler
errorRouter.use(function(err, req, res, next) {
    // render the error page
    res.status(err.status || 500).json({
        error: { 
            message:err.message
        }
    });
});

  module.exports = errorRouter;