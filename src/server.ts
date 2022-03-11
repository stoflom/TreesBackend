import * as express from 'express';
import { connect } from './database/database';
import { json } from 'body-parser';
import { urlencoded } from 'body-parser';

import { theRouter } from './routes/routes';

//import Morgan = require('morgan');

const app = express();
const port = 5002;

app.use(json({ strict: true }));
app.use(urlencoded({ extended: false }));
//app.use(Morgan('combined')) ;


//Register the router
app.use(theRouter);

//TreeModel.init();
//GenusModel.init();

connect();

//Register the router
app.use(theRouter);

app.listen(port, () => {
  console.log(`\nServer started on http://localhost:${port}\n`);
});
