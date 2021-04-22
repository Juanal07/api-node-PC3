
const mariadb = require("mariadb");

const pool = mariadb.createPool({
	host: "2.139.176.212",
	user: "pr_softlusion",
	password: "Softlusion",
	database: "prsoftlusion",
});


module.exports = {
    database: {
        host: 'localhost',
        user: 'antonio',
        password: 'admin',
        database: 'contacts'
    }
};
