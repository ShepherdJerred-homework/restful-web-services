import * as mongoose from 'mongoose';
import * as config from '../config';

mongoose.connect(config.mongodbUrl);
