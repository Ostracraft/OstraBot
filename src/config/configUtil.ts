import { GuildMessage } from "@app/types";
import { PermissionResolvable } from "discord.js";
import { Permissions } from "discord.js";
import settings from "./settings";

export const permissions = Permissions.FLAGS;
export const noPermissions = [] as PermissionResolvable[];
export const hasStaffRole = (message: GuildMessage): string | void => message.member.roles.cache.has(settings.roles.staff) ? null : "no role";