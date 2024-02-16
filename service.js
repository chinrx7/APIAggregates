var Service = require('node-windows').Service;
var svc = new Service({
    name: 'PV Aggregate',
    description: 'Agg for plot data',
    script: 'C:\\PvvApp\\APIAggregate\\app.js'
});

svc.on('install', function () {
    svc.start();
});

svc.install();