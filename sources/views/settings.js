
import {JetView} from "webix-jet";
// import {statuses} from "../models/statuses";
// import {activityTypes} from "../models/activityType";
// import SettingsTable from "./settingsTable";

export default class SettingsView extends JetView {
	config() {
		// const _ = this.app.getService("locale")._;
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
				segmented
				// {

				// 	cols: [
				// 		{$subview: new SettingsTable(this.app, "",
				//		activityTypes, "activityTypesTable", "Activity Types", "Icon", "Add type", "value")},
				// 		{$subview: new SettingsTable(this.app, "",
				//		statuses, "statusesTable", "Status", "Icon", "Add status", "name")}
				// 	]
				// }
			]
		};
	}

	toggleLanguage() {
		const langs = this.app.getService("locale");
		const value = this.$$("SegmentedLanguage").getValue();
		langs.setLang(value);
	}
}
