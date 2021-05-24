const jwt = require('jsonwebtoken');

exports.checkAuth = (req, res, next) => {
    try {
        const tokenData = req.get('Authorization');
        if(tokenData) {
            const token = tokenData.split(' ')[1];
            const secret = process.env.SECRET || 'secretkey';
            const decoded = jwt.verify(token, secret);
            return next();
        }
        res.status(401).json({ message: 'Authorization token missing in request'});
    } catch( err ) {
        if(!err.status) err.status = 401;
        throw new Error(err);
    }
    
}