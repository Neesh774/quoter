/*
Copyright (C) 2020-2021 Nicholas Christopher
This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>
*/

const Discord = require("discord.js");
const db = require("quick.db");

const config = require("../config.json");

module.exports = {
	enabled: true,
	hidden: false,
	name: "prefix",
	description: "Sends the server prefix, or sets a new one.",
	usage: "[New Prefix]",
	example: "!",
	aliases: ["setprefix", "newprefix"],
	cooldown: 10,
	args: false,
	guildOnly: true,
	async execute(message, args) {
		if (args.length) {
			if (
				message.member.hasPermission("MANAGE_GUILD") ||
				message.client.admins.get(message.author.id)
			) {
				if (
					/^[a-zA-Z0-9!_.+#$@%^&*(){}=:;'"\\/\-[\]]{1,3}$/.test(
						args[0]
					)
				) {
					db.set(`${message.guild.id}.prefix`, args[0]);
					const successEmbed = new Discord.MessageEmbed()
						.setTitle("✅ Changed Prefix")
						.setColor(config.colors.success)
						.setDescription(
							`This server's prefix is now \`${args[0]}\` (from \`${message.applicablePrefix}\`). You can also mention me instead!`
						);
					await message.channel.send(successEmbed);
				} else {
					const invalidPrefixEmbed = new Discord.MessageEmbed()
						.setTitle("❌ Invalid Prefix")
						.setColor(config.colors.error)
						.setDescription(
							`\`${args[0]}\` isn't a valid prefix! Prefixes can be alphanumeric, along with some special characters. They cannot be longer than three characters!`
						);
					await message.channel.send(invalidPrefixEmbed);
				}
			} else {
				const noPermissionEmbed = new Discord.MessageEmbed()
					.setTitle("❌ You don't have permission to do that")
					.setColor(config.colors.error)
					.setDescription(
						"That action requires the Manage Guild permission."
					);
				await message.channel.send(noPermissionEmbed);
			}
		} else {
			const prefixEmbed = new Discord.MessageEmbed()
				.setTitle(`\`${message.applicablePrefix}\``)
				.setColor(config.colors.success)
				.setDescription(
					`This server's prefix is \`${message.applicablePrefix}\` - you can also mention me instead!`
				);
			await message.channel.send(prefixEmbed);
		}
	},
};
