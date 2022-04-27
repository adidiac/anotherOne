const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    tiles: [String],
    role: String,
    history: [
        {
        text:String,
        sentiment:String,
        language:String,
        entity:String,
        opinion:String,
    }]
})
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.password
    }
});
const User=mongoose.model('User',userSchema)
module.exports = User;