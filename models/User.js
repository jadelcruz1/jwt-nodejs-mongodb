const mongoose = require('mongoose')

const User = mongoose.model('User', {
    name: String,
    email: String,
    Password: String,
})

module.exports = User

