const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
       senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
       },
       receiverId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
       },
       text:{
        type:String,
       },
       image:{
        type:String,
       },
       timestamp: { 
       type: Date, 
       default: Date.now 
       }
});

const Message = mongoose.model("Message",messageSchema);

module.exports = Message;