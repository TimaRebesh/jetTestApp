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
			data: menuData
		};

		let ui = {
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

	urlChange() {
		const urlTab = this.getUrl()[1].page;
		const page = this.capitalize(urlTab);
		this.$$("headerId").setValues({value: `${page}`});
	}

	capitalize(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
}
