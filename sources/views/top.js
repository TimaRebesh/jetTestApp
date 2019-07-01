import {JetView, plugins} from "webix-jet";
import {menuData} from "../models/menuData";

export default class TopView extends JetView {
	config() {
		let header = {
			type: "header",
			id: "headerId",
			template: obj => obj.value,
			css: "app_header"
		};

		let menu = {
			view: "menu",
			id: "top:menu",
			css: "app_menu webix_shadow_medium",
			width: 180,
			layout: "y",
			select: true,
			template: "<span class='webix_icon #icon#'></span> #value# ",
			data: menuData,
			on: {
				onAfterSelect: (id) => {
					const values = this.$$("top:menu").getItem(id);
					this.$$("headerId").setValues({value: values.value});
				}
			}
		};

		let ui = {
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
