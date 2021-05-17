import { Permissions } from 'discord.js';
import type { PermissionResolvable } from 'discord.js';

import settings from '@app/config/settings';
import type { GuildMessage } from '@app/types';

export const permissions = Permissions.FLAGS;
export const noPermissions = [] as PermissionResolvable[];
export const hasStaffRole = (message: GuildMessage): string | null => (message.member.roles.cache.has(settings.roles.staff) ? null : 'no role');
