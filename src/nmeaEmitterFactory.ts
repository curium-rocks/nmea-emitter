import { IDataEmitter } from "@curium.rocks/data-emitter-base";
import { SerialEmitterFactory, SerialPortSettings } from "@curium.rocks/serial-emitter";
import { NmeaEmitter } from "./nmeaEmitter";

/**
 * Factory for building nmea emitters
 */
export class NmeaEmitterFactory extends SerialEmitterFactory {

    /**
     * Build a data emitter from the provided serial settings
     * @param {SerialPortSettings} settings 
     * @param {string} id 
     * @param {string} name 
     * @param {string} desc 
     * @return {IDataEmitter} 
     */
     build(settings:SerialPortSettings, id: string, name: string, desc: string): Promise<IDataEmitter> {
        return this.provider(settings).then((sp)=>{
            return(new NmeaEmitter(
                sp, 
                this.getTransform(settings.format), id, name, desc, settings));
        })
    }
}