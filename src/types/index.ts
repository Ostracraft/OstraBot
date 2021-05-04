/* eslint-disable @typescript-eslint/naming-convention */
import type {
 Guild, GuildMember, Message, NewsChannel, TextChannel,
} from 'discord.js';
import type { Document, FilterQuery, Model } from 'mongoose';
import type cron from 'node-cron';

/** A TextChannel which is in a guild */
export type GuildTextBasedChannel = NewsChannel | TextChannel;

/** Enforces that message.channel is a TextChannel or NewsChannel, not a DMChannel. */
export type GuildMessage = Message & { channel: GuildTextBasedChannel; member: GuildMember; guild: Guild };

/** Sanctions types */
export enum SanctionTypes {
    KICK, /** 0 */
    WARN, /** 1 */
    TEMPBAN, /** 2 */
    BAN, /** 3 */
}

/**
 * Sanction database types
 */

/** Interface for mongoose's schema */
export interface SanctionBase {
    memberId: string;
    type: SanctionTypes;
    reason: string;
    start: number;
    duration?: number;
    moderatorId: string;
    revoked: boolean;
    channel?: string;
}

/** Interface for mongoose's document */
export interface SanctionDocument extends SanctionBase, Document { }

/** Interface for mongoose's model */
export interface SanctionModel extends Model<SanctionDocument> {
    findOneOrCreate(
        condition: FilterQuery<SanctionDocument>,
        doc: SanctionBase,
    ): Promise<SanctionDocument>;
}

/** Duration object */
export class Duration {
    private readonly mo: number;
    private readonly w: number;
    private readonly d: number;
    private readonly h: number;
    private readonly m: number;
    private readonly s: number;

    // eslint-disable-next-line max-params
    constructor(mo: number, w: number, d: number, h: number, m: number, s: number) {
        this.mo = mo;
        this.w = w;
        this.d = d;
        this.h = h;
        this.m = m;
        this.s = s;
    }

    public getMonths(): number { return this.mo ?? 0; }
    public getWeeks(): number { return this.w ?? 0; }
    public getDays(): number { return this.d ?? 0; }
    public getHours(): number { return this.h ?? 0; }
    public getMinutes(): number { return this.m ?? 0; }
    public getSeconds(): number { return this.s ?? 0; }
    public isEmpty(): boolean {
        return this.getMonths() === 0
                && this.getWeeks() === 0
                && this.getDays() === 0
                && this.getHours() === 0
                && this.getMinutes() === 0
                && this.getSeconds() === 0;
    }

    public asMillis(): number {
        let millis = 0;
        millis += this.getMonths() * 30 * 24 * 60 * 60 * 1000;
        millis += this.getWeeks() * 7 * 24 * 60 * 60 * 1000;
        millis += this.getDays() * 24 * 60 * 60 * 1000;
        millis += this.getHours() * 60 * 60 * 1000;
        millis += this.getMinutes() * 60 * 1000;
        millis += this.getSeconds() * 1000;
        return millis;
    }

    public toString(): string {
        return this.getMonths().toString() + ' months, '
            + this.getWeeks().toString() + ' weeks, '
            + this.getDays().toString() + ' days, '
            + this.getHours().toString() + ' hours, '
            + this.getMinutes().toString() + ' minutes, '
            + this.getSeconds().toString() + ' seconds';
    }

    public humanReadable(): string {
        let s = '';
        if (this.getMonths() > 0)
            s += this.getMonths().toString() + ' mois';
        if (this.getWeeks() > 0)
            s += (s === '' ? '' : ', ') + this.getWeeks().toString() + ' semaine(s)';
        if (this.getDays() > 0)
            s += (s === '' ? '' : ', ') + this.getDays().toString() + ' jour(s)';
        if (this.getHours() > 0)
            s += (s === '' ? '' : ', ') + this.getHours().toString() + ' heure(s)';
        if (this.getMinutes() > 0)
            s += (s === '' ? '' : ', ') + this.getMinutes().toString() + ' minute(s)';
        if (this.getSeconds() > 0)
            s += (s === '' ? '' : ', ') + this.getSeconds().toString() + ' seconde(s)';
        return s;
    }
}

/**
 * From Skript-MC/Swan
 * Informations associated to a task in the TaskHandler
 */
export interface TaskInformations {
    interval?: NodeJS.Timeout;
    schedule?: cron.ScheduledTask;
  }
