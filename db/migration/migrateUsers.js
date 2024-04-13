import mongoose from 'mongoose';
import { User } from '../models/schema.js';


// Connect to MongoDB
mongoose.connect(`mongodb+srv://aryanap3098:${ENV.mongo_Atlas_Password}@dmcd.0avpmjo.mongodb.net/?retryWrites=true&w=majority&appName=DMCD`)

// Define the aggregation pipeline
const pipeline = [
  {
    $addFields: {   
        dateOfBirth: '$dob' 
    }
},
{
    $unset: 'dob' 
},
{
    $out: 'users' 
}
  ];
  
  // Execute the aggregation pipeline
  User.aggregate(pipeline).exec()
    .then((result) => {
      console.log('Documents updated successfully');
    })
    .catch((err) => {
      console.error('Error updating documents:', err);
    })
    .finally(() => {
      mongoose.disconnect();
    });