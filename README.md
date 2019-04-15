# abso-winston-mysql-transport

Winston transport implementation for using with mysql databases.

## Dependencies

* winston (^3.5.1) [[find it here]](https://www.npmjs.com/package/winston)
* winston-transport [dependency for winston]
* sequelize (^5.3.3) [[find it here]](http://docs.sequelizejs.com/)
* mysql2 (^1.6.5) [[find it here]](https://www.npmjs.com/package/mysql2)

## Usage
```javascript
const winston = require('winston');
const MySQLTransport = require('abso-winston-mysql-transport').WinstonMySQLTransport;
const logger = new winston.Logger({
    transports: [
        new MySQLTransport(
            {... options_here ...}
        )
    ]
});
```

## Options structure
```javascript
{
    level?: string (='info'),
    tableName?: string (='winston_log'),
    label?: string (=''),
    connection: {
        host: string,
        port: integer,
        database: string,
        username: string,
        password: string,
        charset?: string (='utf8'),
        collation?: string (='utf8_polish_ci')
    }
}
```
