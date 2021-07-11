# NMEA-Emitter
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=curium-rocks_nmea-emitter&metric=security_rating)](https://sonarcloud.io/dashboard?id=curium-rocks_nmea-emitter) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=curium-rocks_nmea-emitter&metric=coverage)](https://sonarcloud.io/dashboard?id=curium-rocks_nmea-emitter) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=curium-rocks_nmea-emitter&metric=alert_status)](https://sonarcloud.io/dashboard?id=curium-rocks_nmea-emitter)
## How To Install
`npm install --save @curium.rocks/nmea-emitter`
## Example(s)

```typescript
import {SerialDataFormat, SerialParity} from "@curium.rocks/serial-emitter";
import {NmeaEmitterFactory} from "@curium.rocks/nmea-emitter";
import {IDataEmitter, IDataEvent} from "@curium.rocks/data-emitter-base";
import {GGAPacket} from 'simple-nmea';

const factory:NmeaEmitterFactory = new NmeaEmitterFactory();

const emitter:IDataEmitter = await factory.build({
    portName: '/dev/ttyUSB0',
    dataBits: 8,
    parity: SerialParity.NONE,
    stopBits: 1,
    baudRate: 9600,
    format: SerialDataFormat.ASCII_LINES
}, 'unique-id', 'my-test-nmea-emitter', 'A longer description')

const dataListener = emitter.onData((dataEvent:IDataEvent) => {
    console.log(`data: ${dataEvent.data}, emitted at: ${dataEvent.timestamp}, from: ${dataEvent.emitter.name}`);
    if(dataEvent.data instanceof GGAPacket){
        const ggaPacket:GGAPacket = dataEvent.data as GGAPacket;
        console.log(`lat = ${ggaPacket.latitude}, lon = ${ggaPacket.longitude}, alt = ${ggaPacket.altitudeMeters}`);
    }
})

const statusListener = emitter.onStatus((statusEvent) => {
    console.log(`status: connected = ${statusEvent.connected}, at = ${statusEvent.timestamp}, BIT = ${statusEvent.bit}`);
})

dataListener.dispose();
statusListener.dispose();
```
