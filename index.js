const http = require('http');
const ContactSensor = require('./ContactSensor');

class HTTPContactSensor {

    constructor(log, config, api) {
        this.log = log;
        const { hap } = api || {};
        const {
            Service,
            Characteristic
        } = hap || {};
        const {
            sensors: sensorsConfig,
            port = 9080
        } = config || {};
        this.accessoriesArray = sensorsConfig.map((d, i) => new ContactSensor(d, i, Service, Characteristic, log));
        this.sensors = this.accessoriesArray.reduce((acc, curr) => ({...acc, [curr.id]: curr}), {});

        this.server = http.createServer((req, res) => {
            const { url } = req || {};
            const [, sensorId, stateString] = url.match(/\/([a-zA-Z0-9]+)\/(\d)/) || [];
            const state = !!parseInt(stateString, 10);
            const isOK = this.handleRequest(sensorId, state);
            const response = { success: isOK };
            if (isOK) {
                res.end(JSON.stringify(response));
            } else {
                res.statusCode = 404;
                res.end(JSON.stringify(response));
            }
        });

        this.server.listen(port, () => {
            this.log(`Contact Sensor server is listening to port ${port}`);
        });
    }

    handleRequest(sensorId, state) {
        const { [sensorId]: sensor } = this.sensors || {};
        if (sensor) {
            return sensor.triggerState(state);
        }
        return false;
    }

    accessories(callback) {
        callback(this.accessoriesArray);
    }
}

module.exports = api => {
    api.registerPlatform('http-contact-sensor-v2', HTTPContactSensor);
};
