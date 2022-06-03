const Hapi = require('@hapi/hapi');

const init = async () => {
	const server = Hapi.server({
		port: 4001,
		host: 'localhost',
		routes: {
			cors: {
				origin: ['*']
			},
		},
	});

	await server.start();
	console.log(`Server running on port ${server.info.uri}`);
};

init();
