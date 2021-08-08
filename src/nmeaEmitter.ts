import { IDataEvent } from '@curium.rocks/data-emitter-base';
import { SerialEmitter } from '@curium.rocks/serial-emitter';
import {parseNmeaSentence} from 'nmea-simple';

/**
 * Extends {SerialEmitter} and expects to receive NMEA 0183 sentences
 */
export class NmeaEmitter extends SerialEmitter {
    static TYPE: "NMEA-EMITTER";
    /**
     * Builds a NMEA packet if the data is a string, expects complete nmea sentences from 
     * the onData event from the serial emitter 
     * @param {unknown} data raw nmea sentence
     * @return {IDataEvent} wrapped data event that contains a NMEA packet
     */
    public override buildDataEvent(data: unknown) : IDataEvent {
        if(typeof data == 'string') {
            return super.buildDataEvent(parseNmeaSentence(data));
        }
        throw new Error("invalid data type " + typeof data + " for NMEA parsing");
    }

    /**
     * Get the emitter type
     * @return {string}
     */
    public getType(): string {
        return NmeaEmitter.TYPE;
    }
}