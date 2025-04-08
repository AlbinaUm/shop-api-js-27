import mysql, {Connection} from "mysql2/promise";

let connection: Connection;

const mysqlDb = {
    async init() {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'alya4241',
            database: 'shop-js-27'
        });
    },
    async getConnection() {
        return connection;
    }
}

export default mysqlDb;