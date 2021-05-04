import type { GuildMessage } from '@app/types';
import { Duration } from '@app/types';

export default function duration(message: GuildMessage, phrase: string): Duration | null {
    const regex = /(\d*mo)?(\d*w)?(\d*d)?(\d*h)?(\d*m)?(\d*s)?/;
    const matches = regex.exec(phrase);
    const values: number[] = [];
    for (let i = 1; i < 7; i++) {
        let s = matches[i]?.replace(/\D*/, '');
        if (typeof s === 'undefined' || !/\d*/.test(s))
           s = '0';
        values[i] = Number.parseInt(s);
    }
    const result = new Duration(values[1], values[2], values[3], values[4], values[5], values[6]);
    return result.isEmpty() ? null : result;
}
