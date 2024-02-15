var Service = require('node-windows').Service;
var svc = new Service({
    name: 'PV Aggregate',
    description: 'Agg for plot data',
    script: 'D:\\PvvApp\\APIAGGREGATE\\app.js'
});

svc.on('install', function () {
    svc.start();
});

svc.install();