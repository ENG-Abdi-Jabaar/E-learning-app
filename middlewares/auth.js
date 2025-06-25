const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(400).json({msg:"invalid access denied"});
    }

    const token = authHeader.split(' ')[1];

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decode;
        next();
    } catch (err) {
        console.error('Token verification failed:', err.message);
        return res.status(401).json({ msg: 'Invalid or expired token.' });
    }
}

module.exports = protect;