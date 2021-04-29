const mariadb = require("mariadb");
const { database } = require("./keys");

export const pool = mariadb.createPool(database);

// async function asyncFunction() {
// 	let conn;
// 	try {
// 		conn = await pool.getConnection();
// 	} catch (err) {
// 		throw err;
// 	} finally {
// 		if (conn) conn.release(); //release to pool
// 	}
// }
