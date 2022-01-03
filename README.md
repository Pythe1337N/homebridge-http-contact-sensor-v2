# homebridge-http-contact-sensor-v2
Easily add one or many simple http based contact sensors with this plugin.

## Configuration
* ```platform``` must be set to ```"http-contact-sensor-v2"``` for this plugin to be active.
* ```port``` sets the port for the http server to listen on. (optional, default 9080)
* ```sensors[]``` an array of sensor configurations.

### sensors[]
* ```name``` sets the sensor name displayed in the Home app.
* ```id``` sets the id of a sensor.
    * Must be unique.
    * Only letters a-z and numbers 0-9 are allowed.
    * Is case sensitive.
* ```manufacturer``` sets the manufacturer name in the Home app (optional).
* ```model``` sets the model name in the Home app (optional).
* ```serialNumber``` sets the serial number name in the Home app (optional).

## How to trigger
The plugin will expose an endpoint that is equal to:

```http://<homebridge_server_ip>:<plugin_port>/<sensor_id>/<sensor_state>```

Just make a ```GET``` request to this url and the contact sensor should trigger.
```sensor_state``` should be an integer where a value of 0 means the contact is closed and a 1 (or any other positive value) will count as open.
Remember that the sensor id is case sensitive.

If the http request succeeds you'll get the following response with a status code of 200:

```json
{
  "success": true
}
```

If you try to access an unspecified sensor id, you'll get this response with a status code of 404:

```json
{
  "success": false
}
```


## Example configuration 
```json
{
  "platforms": [
    {
      "platform": "http-contact-sensor-v2",
      "port": 9091,
      "sensors": [
        {
          "name": "Front door",
          "id": "door",
          "manufacturer": "Contact Sensors Inc.",
          "model": "Contact Sensor 2000",
          "serialNumber": "XYZ123"
        }
      ]
    }
  ]
}
```
