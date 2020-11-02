module.exports = {
	server: {
		port: process.env.PORT || 3000,
		salt: 5,
		jwtSecret: "stanchevvv",
		cookieName: "msslhut"
	},
	database: {
		connectionString: "mongodb://localhost:27017/",
		databaseName: "tutorials"
	}
};
