import { Duration, GuildMessage } from '@app/types';

export default function duration(message: GuildMessage, phrase: string): Duration | null {
    const regex = new RegExp("([0-9]*mo)?([0-9]*w)?([0-9]*d)?([0-9]*h)?([0-9]*m)?([0-9]*s)?");
    const matches = phrase.match(regex);
    let values: number[] =  [];
    for(let i = 1; i<7; i++) {
        let s = matches[i]?.replace(/\D*/, "");
        if(typeof s == 'undefined' || !s?.match(/\d*/))
           s = "0";
        values[i] = Number.parseInt(s); 
    }
    const duration = new Duration(values[1], values[2], values[3], values[4], values[5], values[6]);
    return duration.isEmpty() ? null : duration;    
}