import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  avatar: { type: String },
  session: { login: { type: Date }, logout: { type: Date } },
  settings: {
    theme: { type: String, default: 'light' },
    wordsPerDay: { type: Number, default: 60 },
    srs: [
      { type: Number, default: 8 },
      { type: Number, default: 23 },
      { type: Number, default: 47 },
      { type: Number, default: 167 },
      { type: Number, default: 335 },
      { type: Number, default: 719 },
      { type: Number, default: 1439 },
      { type: Number, default: 2879 },
    ],
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    return next();
  } catch (error) {
    return next(error);
  }
});
userSchema.pre('findOneAndUpdate', async function (next) {
  if (this._update.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this._update.password, salt);

      return next();
    } catch (error) {
      return next(error);
    }
  }

  return next();
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};
userSchema.methods.getPublicFields = function () {
  const { _id, username, firstName, lastName, settings, avatar, session } = this;
  return { _id, username, firstName, lastName, settings, avatar, session };
};

export default mongoose.models.User || mongoose.model('User', userSchema);
