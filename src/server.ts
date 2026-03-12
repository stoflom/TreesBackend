
import { connect } from './database/database.ts';
import { theRouter } from './routes/routes.ts';
import morgan from 'morgan';
import express from 'express';
import cors from 'cors';

const port = 5002;

const app = express();

app.use(cors());
app.use(express.json({ strict: true }));
app.use(express.urlencoded({ extended: false }));
app.use(morgan('combined'));

//Register the router
app.use(theRouter);

connect();

app.listen(port, () => {
  console.log(`\nServer started on http://127.0.0.1:${port}\n`);
});
