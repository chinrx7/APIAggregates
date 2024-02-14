
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./configure/config.json', 'utf8'));
const aggCfg = JSON.parse(fs.readFileSync('./configure/agg.json', 'utf8'));
exports.config = config;
exports.aggCfg = aggCfg;
const schedule = require('node-schedule');
const agg = require('./middleware/aggregation');

const rule = new schedule.RecurrenceRule();
rule.minute = [0, 10, 20, 30, 40, 50];
agg.getData();

const job = schedule.scheduleJob(rule, () => {
    console.log(new Date)
    agg.getData();
})