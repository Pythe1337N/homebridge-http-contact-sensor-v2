class ContactSensor {
    constructor(config, index, Service, Characteristic, log) {
        this.Service = Service;
        this.Characteristic = Characteristic;
        this.log = log;

        const {
            name,
            id,
            manufacturer,
            model,
            serialNumber,
        } = config;
        this.name = name;
        this.id = id || index;
        this.manufacturer = manufacturer || 'Pythe1337N Inc.';
        this.model = model || 'Pythe1337N Contact Sensor';
        this.serialNumber = serialNumber || this.id;
        this.state = false;
    }

    getState(callback) {
        callback(null, this.state);
    }

    getServices() {
        const info = new this.Service.AccessoryInformation();
        info.setCharacteristic(this.Characteristic.Manufacturer, this.manufacturer)
            .setCharacteristic(this.Characteristic.Model, this.model)
            .setCharacteristic(this.Characteristic.SerialNumber, this.serialNumber);

        this.service = new this.Service.ContactSensor(this.name);
        this.service.getCharacteristic(this.Characteristic.ContactSensorState)
            .on('get', this.getState.bind(this));

        return [info, this.service];
    }

    triggerState(state) {
        this.state = state;
        this.service.getCharacteristic(this.Characteristic.ContactSensorState).setValue(this.state);
        return true;
    }

}

module.exports = ContactSensor;
