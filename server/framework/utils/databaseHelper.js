/**
 * Database connection pool with MySQL
 *
 * This class uses config from config/users.json - make sure you fill in the right details there found on PAD cloud!
 *
 * @author Pim Meijer & Lennard Fonteijn
 */

class DatabaseHelper {
    #mysql = require("mysql");
    #dbConfig = serverConfig.database;
    #connectionPool;

    /**
     * Makes a connection to the database. Only do this once in application lifecycle.
     */
    constructor() {
        this.#initConnection()
    }

    /**
     * Initializes the connection and sets the connection pool attribute
     * @private
     */
    #initConnection() {
        //added a small delay to make sure this log ends up at the bottom at start server
        setTimeout(() => console.log(this.#dbConfig), 500);

        //check for valid db config in the config.<env>.json file
        if (!this.#dbConfig.host || !this.#dbConfig.database || !this.#dbConfig.username || !this.#dbConfig.password) {
            console.log(`Error: '${serverConfigFile}' not configured! Please fill in your team's credentials!`);

            return;
        }

        this.#connectionPool = this.#mysql.createPool({
            host: this.#dbConfig.host,
            user: this.#dbConfig.username,
            password: this.#dbConfig.password,
            database: this.#dbConfig.database,
            connectionLimit: this.#dbConfig.connectionLimit, //NOTE: Each team only has a maximum of 10 connections, this includes MySQL Workbench connections.
            timezone: "UTC",
            multipleStatements: true
        });

        //Quicktest connection for errors
        this.#connectionPool.getConnection((err, conn) => {
            if (err) {
                console.log(err);
                console.error(`${err.errno} ${err.code}: ${err.sqlMessage}`);
            } else {
                conn.release();
            }
        });
    }

    /**
     * Use this function for all queries to database
     * @param data contains query with "?" parameters(values)
     */
    handleQuery(data) {
        return new Promise((resolve, reject) => {
            this.#connectionPool.query({
                sql: data.query,
                values: data.values,
                timeout: this.#dbConfig.timeout
            }, (error, results) => {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    console.log("Query results: ");
                    console.log(results);
                    resolve(results);
                }
            });
        });
    }
}

//instantiate directly to enforce one instance of this class
module.exports = new DatabaseHelper();