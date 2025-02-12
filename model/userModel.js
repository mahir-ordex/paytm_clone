const  mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(' mongodb://127.0.0.1:27017/paytm').then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=> {
    console.error('Failed to connect to MongoDB', err);
})


// Define the Paytm schema
const userSchema = new mongoose.Schema({
    userName:{
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 40
    },
    firstName:{
        type: String,
        required: true,
    },
    lastName:{
        type:String,
        required: true,
    },
    middleName:{
        type: String,
        default:''
    },
    password:{
        type: String,
        required: true,

    },
    profilePicture:{
        type: String,
        default: 'https://as2.ftcdn.net/v2/jpg/10/54/09/27/1000_F_1054092780_liObYQo10Pn2xOo4CmGYZMeWiw0P7CT2.jpg',
    }
})

const User = mongoose.model('User', userSchema);


module.exports = User;

