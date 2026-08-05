
import { connect } from './database/database.ts';
import '@std/dotenv/load';
import { theRouter } from './routes/routes.ts';
import morgan from 'morgan';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

const port = 5002;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the repo root (where VERSION lives)
const repoRoot = path.resolve(__dirname, '../..');

// Path to the Angular build output
const frontendDist = path.resolve(__dirname, '../../TreesFrontend/dist/trees-frontend/browser');

// Read version from VERSION file
const version = readFileSync(path.join(repoRoot, 'VERSION'), 'utf-8').trim();

const app = express();

app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:5002', 'http://192.168.0.10:4200', 'http://192.168.0.10:5002'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ strict: true }));
app.use(express.urlencoded({ extended: false }));
app.use(morgan('combined'));

//API routes
app.get('/api/version', (_req, res) => {
  res.json({ version });
});
app.use(theRouter);

//Static frontend files
app.use(express.static(frontendDist));

// SPA fallback: serve index.html for non-API routes
app.get('{*path}', (_req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

connect();

app.listen(port, () => {
  console.log(`\nServer started on http://127.0.0.1:${port}\n`);
});
