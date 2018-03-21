import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyparser from 'body-parser';
import * as userRoutes from './user/routes';
import * as classRoutes from './class/routes';
import * as studentRoutes from './students/routes';

export const app: express.Express = express();

app.use(morgan('dev'));
app.use(express.static(__dirname + '../../../static'));
app.use(bodyparser.json());

app.use('/api/users', userRoutes.router);

app.use('/api/classes', classRoutes.router);

app.use('/api/rosters', studentRoutes.router);
