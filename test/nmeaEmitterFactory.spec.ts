import { describe, it} from 'mocha';
import { expect } from 'chai';
import * as TypeMoq from "typemoq";
import { SerialDataFormat, SerialParity } from '@curium.rocks/serial-emitter';
import * as SerialPort from 'serialport';
import { NmeaEmitter } from '../src/nmeaEmitter';
import { NmeaEmitterFactory } from '../src/nmeaEmitterFactory';
import { IDataEmitter, IEmitterDescription, IFormatSettings, ProviderSingleton } from '@curium.rocks/data-emitter-base';
import crypto from 'crypto';

const mockSerialPort = TypeMoq.Mock.ofType<SerialPort>();
const factory = new NmeaEmitterFactory();
factory.setProvider((() => Promise.resolve(mockSerialPort.target)))
ProviderSingleton.getInstance().registerEmitterFactory(NmeaEmitter.TYPE, factory);
const specification: IEmitterDescription = {
    id: 'test-id',
    description: 'test-desc',
    name: 'test-name',
    type: NmeaEmitter.TYPE,
    emitterProperties: {
        portName: 'test',
        baudRate: 9600,
        stopBits: 2,
        parity: SerialParity.NONE,
        dataBits: 8,
        format: SerialDataFormat.ASCII_LINES
    }
};

/**
 * 
 * @param {IDataEmitter} emitter 
 */
function validateEmitter(emitter : IDataEmitter ) : void {
    expect(emitter).to.be.instanceOf(NmeaEmitter);
    const nmeaEmitter = emitter as NmeaEmitter;
    expect(nmeaEmitter.id).to.be.eq(specification.id);
    expect(nmeaEmitter.name).to.be.eq(specification.name);
    expect(nmeaEmitter.description).to.be.eq(specification.description);
    const metaData = nmeaEmitter.getMetaData() as Record<string, unknown>;
    const props = specification.emitterProperties as Record<string, unknown>;
    expect(metaData.portName).to.be.eq(props.portName);
    expect(metaData.baudRate).to.be.eq(props.baudRate);
}

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
    describe('buildEmitter()', function() {
        it('Should return a nmea emitter matching specifications', async function() {
            const emitter = await ProviderSingleton.getInstance().buildEmitter(specification);
            validateEmitter(emitter);
        });
    });
    describe('recreateEmitter()', function() {
        it('Should recreate from plain text state', async function () {
            const emitter = await ProviderSingleton.getInstance().buildEmitter(specification);
            validateEmitter(emitter);
            const formatSettings : IFormatSettings = {
                encrypted: false,
                type: NmeaEmitter.TYPE
            }
            const state = await emitter.serializeState(formatSettings);
            const recreatedEmitter = await ProviderSingleton.getInstance().recreateEmitter(state, formatSettings);
            validateEmitter(recreatedEmitter);
        });
        it('Should recreate from aes-256-gcm cipher text', async function() {
            const emitter = await ProviderSingleton.getInstance().buildEmitter(specification);
            validateEmitter(emitter);
            const formatSettings : IFormatSettings = {
                encrypted: true,
                type: NmeaEmitter.TYPE,
                algorithm: 'aes-256-gcm',
                key: crypto.randomBytes(32).toString('base64'),
                iv: crypto.randomBytes(64).toString('base64')
            }
            const state = await emitter.serializeState(formatSettings);
            const recreatedEmitter = await ProviderSingleton.getInstance().recreateEmitter(state, formatSettings);
            validateEmitter(recreatedEmitter);
        });
    });
});