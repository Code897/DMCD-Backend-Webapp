import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, "Please provide a unique email"],
        unique: [true, "Account with this email already exists"],
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        },
        verified: {
            type: Boolean,
            default: false
        }
    },
    phone: {
        type: Number,
        required: [true, "Please provide a unique phone number"],
        unique: [true, "Account with this phone number already exists"],
        validate: {
            validator: function (v) {
                return /\d{10}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    password: {
        type: String,
        required: [true, "Please provide a password"]
    },
    usertype: {
        type: String,
        default: 'CUSTOMER',
        enum: ['CUSTOMER', 'ADMIN', 'STAFF','DRIVER']
    },
    city: String,
    religion: {
        type: String,
        enum: ['hindu', 'muslim', 'sikh', 'christian', 'other']
    },
    dateOfBirth: {
        type: String,
        validate: {
            validator: function (v) {
                return /^\d{4}-\d{2}-\d{2}$/.test(v);
            },
            message: props => `${props.value} is not a valid date format (YYYY-MM-DD)!`
        }
    },
    gender: {
        type: String,
        enum: ['M', 'F', 'Other']
    }
});

const homeDataSchema = new mongoose.Schema({
    homeImage: {
        type: {
            id: { type: String, required: true },
            link: { type: String, required: true },
            deletehash: { type: String, required: true }
        },
        required: true
    },
    homeTitle: {
        type: String,
        required: true
    },
    homeText: {
        type: String,
        required: true
    }
});

const blogSchema = new mongoose.Schema({
    _id: {
        type: String,
    },
    image: {
        type: {
            id: { type: String, required: true },
            link: { type: String, required: true },
            deletehash: { type: String, required: true }
        },
        required: true
    },
    highlights: {
        type: [String],
        default: []
    },
    postStory: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const driverSchema = new mongoose.Schema({
    _id: {
        type: String,
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, "Please provide a unique email"],
        unique: [true, "Account with this email already exists"],
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        },
        verified: {
            type: Boolean,
            default: false
        }
    },
    phone: {
        type: Number,
        required: [true, "Please provide a unique phone number"],
        unique: [true, "Account with this phone number already exists"],
        validate: {
            validator: function (v) {
                return /\d{10}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    password: {
        type: String,
        required: [true, "Please provide a password"]
    },
    usertype: {
        type: String,
        default:'DRIVER'
    },
    city: String,
    religion: {
        type: String,
        enum: ['hindu', 'muslim', 'sikh', 'christian', 'other']
    },
    dateOfBirth: {
        type: String,
        validate: {
            validator: function (v) {
                return /^\d{4}-\d{2}-\d{2}$/.test(v);
            },
            message: props => `${props.value} is not a valid date format (YYYY-MM-DD)!`
        }
    },
    gender: {
        type: String,
        enum: ['M', 'F', 'Other']
    }
});
 


const User = mongoose.model('User', userSchema);
const HomeData = mongoose.model('HomeData', homeDataSchema);
const Blog = mongoose.model('Blog', blogSchema);
const Driver = mongoose.model('Driver', driverSchema)


export { User, HomeData, Blog, Driver }