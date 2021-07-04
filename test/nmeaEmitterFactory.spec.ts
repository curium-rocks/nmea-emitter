import { describe, it} from 'mocha';
import { expect } from 'chai';
import * as TypeMoq from "typemoq";
import { SerialDataFormat, SerialParity } from '@curium.rocks/serial-emitter';
import * as SerialPort from 'serialport';
import { NmeaEmitter } from '../src/nmeaEmitter';
import { NmeaEmitterFactory } from '../src/nmeaEmitterFactory';

const mockSerialPort = TypeMoq.Mock.ofType<SerialPort>();
const factory = new NmeaEmitterFactory();
factory.setProvider((() => Promise.resolve(mockSerialPort.target)))

describe( 'nmeaEmitterFactory', function() {
    describe('build()', function() {
        it('Should return a nmea emitter',async function() {
             const emitter = await factory.build({
                portName: '/dev/ttys003',
                baudRate: 9600,
                dataBits: 8,
                parity: SerialParity.NONE,
                stopBits: 2,
                format: SerialDataFormat.ASCII_LINES
            }, 'test', 'test', 'test');

            expect(emitter).not.to.be.null;
            expect(emitter).to.be.instanceOf(NmeaEmitter);
        })
    })
});