
import { connect } from './database/database';
import { json } from 'body-parser';
import { urlencoded } from 'body-parser';

import { theRouter } from './routes/routes';

//import Morgan = require('morgan');

import express = require('express');
import cors = require('cors');

const port = 5002;

const app =express();
app.use(cors());
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
  console.log(`\nServer started on http://127.0.0.1:${port}\n`);
});
