import {JetView} from "webix-jet";
// import {statuses} from "../../models/statuses";
// import {activityTypes} from "../../models/activityTypes";
export default class SettingsView extends JetView {
	config() {
		const lang = this.app.getService("locale").getLang();

		const segmented = {
			view: "segmented",
			value: lang,
			id: "SegmentedLanguage",
			inputWidth: 300,
			options: [
				{id: "en", value: "EN"},
				{id: "ru", value: "RU"}
			],
			click: () => this.toggleLanguage()
		};


		return {
			rows: [
				segmented,
				{
					cols: [
						{},
						{}
					]
				}
			]
		};
	}

	toggleLanguage() {
		const langs = this.app.getService("locale");
		const value = this.$$("SegmentedLanguage").getValue();
		langs.setLang(value);
	}
}

