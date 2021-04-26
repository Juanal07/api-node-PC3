const mariadb = require("mariadb");
const { database } = require("./keys");

export const pool = mariadb.createPool(database);

async function asyncFunction() {
	let conn;
	try {
		conn = await pool.getConnection();
	} catch (err) {
		throw err;
	} finally {
		if (conn) conn.release(); //release to pool
	}
}

// pool.getConnection((err: any, connection: any) => {
// 	if (err) {
// 		if (err.code === "PROTOCOL_CONNECTION_LOST") {
// 			console.log("DATABASE CONNECTION WAS CLOSED");
// 		}
// 		if (err.code === "ER_CON_COUNT_ERROR") {
// 			console.log("DATABASE HAS TO MANY CONNECTIONS");
// 		}
// 		if (err.code === "ECONNREFUSED") {
// 			console.log("DATABASE CONNECTION WAS REFUSED");
// 		}
// 	}
// 	if (connection) connection.release();
// 	console.log("connected ! connection id is " + connection.threadId);
// 	return;
// });
