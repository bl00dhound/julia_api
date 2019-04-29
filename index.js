require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const http = require('http');
const httpShutdown = require('http-shutdown');
const requestLog = require('express-request-log');
const bodyParser = require('body-parser');
const cors = require('cors');

const log = require('./providers/log');
const db = require('./providers/db');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const authenticate = require('./middlewares/authenticate');

const app = express();
const server = httpShutdown(http.createServer(app));

const shutdown = () => {
	server.shutdown(() => log.info('admin application stopped', () => process.exit(0)));
};
const startCallback = () => {
	log.info('admin application started', { pid: process.pid, port: process.env.PORT });
};

process.on(
	'uncaughtException',
	e => log.error('fatal', { error: e.message, stack: e.stack }, () => process.exit(75))
);

log.info('Starting application...');

db.checkConnection();

log.info(process.env.CNFG_DB__CONNECTION__HOST);

app.use(cors());
app.enable('trust proxy');
app.disable('x-powered-by');

app.use(requestLog(log,
	{
		headers: true,
		request: true,
		response: false
	}));
app.use(helmet());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: false }));

require('./middlewares/passport');

app.use('/v1', authenticate, routes);
app.use('/public', express.static('uploads'));

app.use('*', (req, res) => res.status(404).send({ message: 'Resource not found' }));

app.use(errorHandler);

server.listen(process.env.PORT, '0.0.0.0', startCallback);

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
