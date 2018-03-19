import * as mongoose from 'mongoose';
import * as config from '../config';

(async function connect () {
  try {
    await mongoose.connect(config.mongodbUrl);
  } catch (err) {
    console.log(err);
  }
})();
