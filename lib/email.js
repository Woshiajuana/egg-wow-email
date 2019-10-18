'use strict';

const nodemailer = require('nodemailer');

function createClient(config, app) {
    const { host, port, auth, useLog = true } = config;
    const _log = (str) => useLog && app.logger.info(str);
    _log(`[egg-wow-email] connecting host:${host} port:${port} auth:${auth}`);
    const smtpTransport = nodemailer.createTransport(config);
    smtpTransport.send = async (options) => {
        const { to, subject, html } = options;
        _log(`[egg-wow-email] send start to:${to} subject:${subject} html:${html} `);
        const result = await smtpTransport.sendMail({ from: auth.user, ...options });
        _log(`[egg-wow-email] send end to:${to} subject:${subject} html:${html} result: ${JSON.stringify(result)}`);
        return result.response === '250 Data Ok: queued as freedom' ? Promise.resolve() : Promise.reject(new Error(`send email error ${JSON.stringify(result)}`));
    };
    return smtpTransport;
}

module.exports = app => {
    app.addSingleton('email', createClient);
};
