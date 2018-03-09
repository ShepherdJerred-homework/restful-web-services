import * as express from 'express';
import * as morgan from 'morgan';

export const app: express.Express = express();

app.use(morgan('dev'));
app.use(express.static(__dirname + '../../../static'));
