const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

const MessageSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}
);

// Virtual for date
MessageSchema.virtual('formatted_timestamp').get(function () {
    return DateTime.fromJSDate(this.timestamp).toFormat('LLL dd, yyyy');
}
);

module.exports = mongoose.model('Message', MessageSchema);
