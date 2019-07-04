import {JetView} from "webix-jet";

export default class SettingsView extends JetView {
	config() {
		const segmented = {
			view: "segmented",
			inputWidth: 250,
			options: [
				{id: "en", value: "EN"},
				{id: "ru", value: "RU"}
			],
			click: () => this.toggleLanguage()
		};


		return {
			rows: [
				segmented
			]
		};
	}
}

