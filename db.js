const mongoose = require('mongoose')
const mongouri = 'mongodb://127.0.0.1:27017/inotebook'

const connectToMongo = () => {
    mongoose.connect(mongouri).then(console.log("connected to mongoose")).catch((e) => { console.log(e) })
}

module.exports = connectToMongo;