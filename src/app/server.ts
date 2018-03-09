import { app } from './';
import { serverPort } from '../config';

app.listen(serverPort, function () {
  console.log('Express server listening on port ' + serverPort);
});
