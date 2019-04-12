# winston-mysql-transport

Winston transport implementation for using with mysql databases.

## Dependencies

* winston [[find it here]](https://www.npmjs.com/package/winston)
* winston-transport [dependency for winston]
* sequelize [[find it here]](http://docs.sequelizejs.com/)

## Usage
```javascript
const winston = require('winston');
const MySQLTransport = require('winston-mysql-transport').WinstonMySQLTransport;
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

## Creating NPM package

Inside the directory `winston-mysql-transport` run the commend `npm init` and follow the instructions.
As a main package file select `index.js`. Select License and insert all remaining data.
