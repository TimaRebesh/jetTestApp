import {JetView, plugins} from "webix-jet";

export default class TopView extends JetView {
	config() {
		let header = {
			view: "toolbar",
			elements: [
				{gravity: 1},
				{view: "label", label: "Contacts"},
				{gravity: 7}
			]
		};

		let menu = {
			view: "menu",
			id: "top:menu",
			css: "app_menu",
			width: 180,
			layout: "y",
			select: true,
			template: "<span class='webix_icon #icon#'></span> #value# ",
			data: [
				{value: "Contacts", id: "contacts", icon: "mdi mdi-account-group"},
				{value: "Activities", id: "activities", icon: "mdi mdi-calendar-month"},
				{value: "Settings", id: "settings", icon: "mdi mdi-cogs"}
			]
		};

		let ui = {
			type: "clean",
			paddingX: 5,
			css: "app_layout",
			rows: [
				header,
				{
					cols: [
						{
							paddingX: 1,
							paddingY: 1,
							rows: [
								{css: "webix_shadow_medium", rows: [menu]}]
						},
						{
							type: "wide",
							paddingY: 1,
							paddingX: 1,
							rows: [
								{$subview: true}
							]
						}
					]
				}
			]
		};

		return ui;
	}

	init() {
		this.use(plugins.Menu, "top:menu");
	}
}
