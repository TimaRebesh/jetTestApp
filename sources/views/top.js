import {JetView, plugins} from "webix-jet";
import {menuData} from "../models/menuData";

export default class TopView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		let header = {
			type: "header",
			id: "headerId",
			template: obj => _(obj.value),
			css: "webix_header app_header"
		};

		let menu = {
			view: "menu",
			id: "top:menu",
			css: "app_menu",
			width: 180,
			layout: "y",
			select: true,
			template: obj => `<span class='webix_icon ${obj.icon}'></span> ${_(obj.value)}`,
			data: menuData,
			on: {
				onAfterSelect: (id) => {
					const values = this.$$("top:menu").getItem(id);
					this.$$("headerId").setValues({value: values.value});
				}
			}
		};

		let ui = {
			type: "clean",
			paddingX: 5,
			css: "app_layout",
			rows: [
				header,
				{
					cols: [
						menu,
						{$subview: true}
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
