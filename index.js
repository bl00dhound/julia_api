require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const http = require('http');
const httpShutdown = require('http-shutdown');
const requestLog = require('express-request-log');
const bodyParser = require('body-parser');

const log = require('./providers/log');
const routes = require('./routes');

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

app.use('/v1', routes);

app.use('*', (req, res) => res.status(404).send({ message: 'Resource not found' }));

server.listen(process.env.PORT, '0.0.0.0', startCallback);

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
