const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const Schema = mongoose.Schema;

const urlSchema = new Schema({
  originalUrl: { type: String, required: true },
  shortId: {type: Number, unique: true}
}, { timestamps: true });

urlSchema.plugin(AutoIncrement, { inc_field: 'shortId' });


const Url = mongoose.model('Url', urlSchema);
module.exports = Url;