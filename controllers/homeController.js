const Message = require('../models/messageModel');

exports.index = (req, res, next) => {
    const messages = Message.find()
    .populate('user')
    .sort({ timestamp: -1 })
    .exec((err, messages) => {
        if (err) return next(err);
        res.render('index', { title: 'Home',user: req.user ,content: messages });

        }
    );
}