const mariadb = require("mariadb");

const { config } = require("./config");

const pool = mariadb.createPool(config);
pool.getConnection()
    .then(conn => {
      console.log("connected ! connection id is " + conn.threadId);
      conn.release(); //release to pool
    })
    .catch(err => {
      console.log("not connected due to error: " + err);
    });






	// .then((conn) => {
	// 	console.log("Conectado a MariaDB! connection id is " + conn.threadId);
	// 	conn
	// 		.query("SELECT * FROM user WHERE name='Juan'")
	// 		.then((rows) => {
	// 			console.log(rows); 
	// 		})
	// 		.catch((err) => {
	// 		});
	// })
	// .catch((err) => {
	// 	console.log("No conecta debido a un error: " + err);
	// });

module.exports = pool;
