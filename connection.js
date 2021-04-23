const mariadb = require("mariadb");
const { mariadb_database } = require('./config')

const connection = mariadb.createConnection(mariadb_database)

.then(conn => {
        console.log("Conectado a MariaDB! connection id is " + conn.threadId);
        /*conn.query("SELECT * FROM user")
            .then(rows => {
                console.log(rows); //[ { 'NOW()': 2018-07-02T17:06:38.000Z }, meta: [ ... ] ]
            })
            .catch(err => {
                //handle error
            });*/
    })
    .catch(err => {
        console.log("No conecta debido a un error: " + err);
    });


module.exports = connection