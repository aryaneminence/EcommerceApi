const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Userschema = mongoose.Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    default: null,
  },
  profile_pic: {
    type: String,
    default: null,
  },
  user_role: {
    type: String,
    enum: ["user", "company_admin",  "reseller", "wholeseller"],
    default: "user",
  },
});

const User = mongoose.model('User', Userschema);

module.exports = User;
