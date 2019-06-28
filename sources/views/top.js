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
			css: "app_menu",
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
			type: "clean",
			paddingX: 5,
			css: "app_layout",
			rows: [
				header,
				{
					cols: [
						{
							css: "webix_shadow_medium",
							rows: [menu]
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
