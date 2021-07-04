import { describe, it} from 'mocha';
import { expect } from 'chai';
import {Transform} from 'serialport';
import SerialPort from 'serialport';
import * as TypeMoq from "typemoq";
import {GGAPacket} from 'nmea-simple';
import {NmeaEmitter} from '../src/nmeaEmitter';
import { NmeaEmitterFactory } from '../src/nmeaEmitterFactory';

const factory = new NmeaEmitterFactory();

const mockSerialPort = TypeMoq.Mock.ofType<SerialPort>();
const mockTransform = TypeMoq.Mock.ofType<Transform>(SerialPort.parsers.Readline);
mockSerialPort.callBase = false;

interface Callback {
    (chunk: string): void
}


factory.setProvider((() => Promise.resolve(mockSerialPort.target)))

describe( 'NmeaEmitter', function() {
    describe( 'onData', function() {
        it( 'Should provide packetized nmea sentences', function(done) {
            let dataCallback: Callback | null = null;
            
            mockTransform.setup(a => a.on(TypeMoq.It.isValue<string>('data'), TypeMoq.It.isAny())).callback((str, func)=>{
                dataCallback = func as Callback;
            });

            const emitter = new NmeaEmitter(mockSerialPort.object, mockTransform.object, 'test', 'test', 'test');
            emitter.onData((dataEvt) => {
                const ggaPacket:GGAPacket = dataEvt.data as GGAPacket;
                expect(ggaPacket.latitude).to.be.eq(37.39109795066667);
                expect(ggaPacket.longitude).to.be.eq(-122.03782631066667);
                expect(ggaPacket.altitudeMeters).to.be.eq(18.893);
                done();
            });
            expect(dataCallback).to.not.be.null;
            if(dataCallback != null) {
                (dataCallback as Callback)("$GPGGA,172814.0,3723.46587704,N,12202.26957864,W,2,6,1.2,18.893,M,-25.669,M,2.0,0031*4F");
            }
        });
    });
});