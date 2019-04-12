/**
 * Copyright (c) 2019-present, Absolvent
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const winston = require('winston');
const Sequelize = require('sequelize');

class WinstonMySQLTransport extends winston.Transport {
    /**
     * Constructor for the universal transport object.
     * @constructor
     * @param {Object} options
     * @param {string} [options.label] - Label stored with entry object if defined.
     * @param {string} [options.level=info] - Level of messages that this transport
     * should log.
     * @param {string} [options.name] - Transport instance identifier. Useful if you
     * need to create multiple universal transports.
     * @param {string} [options.tableName=winston_logs] - The name of the table you
     * want to store log messages in.
     * @param {Object} [options.connection] - Connection data to connect with database.
     * @param {string} [options.connection.database] - Database name to use.
     * @param {string} [options.connection.username] - Database user name.
     * @param {string} [options.connection.password] - Database user password.
     * @param {string} [options.connection.port] - Database port used to connection.
     * @param {string} [options.connection.host] - Database host to connect with.
     * @param {string} [options.connection.charset=utf8] - Database connection charset.
     * @param {string} [options.connection.collate=utf8_polish_ci] - Database connection collate.
     */
    constructor(options = {}) {
        super();
        this.name = 'MySQLTransport';

        this.label = options.label || '';
        this.level = options.level || 'info';
        this.tableName = options.tableName || 'winston_logs';

        this.connection = options.connection || {};

        this.connection.charset = options.connection.charset || 'utf8';
        this.connection.collate = options.connection.collate || 'utf8_polish_ci';

        this.sequelize = new Sequelize(this.connection.database, this.connection.username, this.connection.password, {
            dialect: 'mysql',
            port: this.connection.port,
            host: this.connection.host,
            logging: false,
        });

        this.initTable().catch(err => console.log('Database error:', err));
    }

    /**
     * Core logging method exposed to Winston. Metadata is optional.
     * @param {string} level - Level at which to log the message.
     * @param {string} message - Message to log
     * @param {Object} meta - Metadata to log
     * @param {Function} callback - Continuation to respond to when complete.
     */
    log(...args) {
        const lvl = args.shift() || this.level;
        const message = args.shift() || '';
        let meta = args.shift();
        let callback = args.shift();

        if (typeof meta === 'function') {
            callback = meta;
            meta = {};
        }

        const { tableName, sequelize } = this;

        return sequelize.query(`INSERT INTO ${tableName} (level, message, meta, timestamp) VALUES ('${lvl}', '${message}', '${JSON.stringify(meta)}', CURRENT_TIMESTAMP)`)
            .then(() => callback(null, true))
            .catch(err => callback(err));
    }

    /**
     * Create logs table.
     * @return {Promise} result of creation within a Promise
     */
    initTable() {
        const { sequelize, tableName } = this;
        const { charset, collate } = this.connection;

        return sequelize.query(`CREATE TABLE IF NOT EXISTS \`${tableName}\` (` +
            `\`id\` int(11) unsigned NOT NULL AUTO_INCREMENT, ` +
            `\`level\` varchar(15) COLLATE ${collate} NOT NULL DEFAULT '',` +
            `\`message\` text COLLATE ${collate},` +
            `\`meta\` text COLLATE ${collate},` +
            `\`timestamp\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, ` +
            `PRIMARY KEY (\`id\`)` +
            `) ENGINE=InnoDB DEFAULT CHARSET=${charset} COLLATE=${collate};`);
    }
}

module.exports = { WinstonMySQLTransport };
