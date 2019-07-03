import {JetView} from "webix-jet";
import {activities} from "../models/activities";
import {activityTypes} from "../models/activityTypes";
import {contacts} from "../models/contacts";
import PopupView from "./popupView";

export default class ActivitiesView extends JetView {
	config() {
		const filterOptions = [
			{id: "1", value: "All"},
			{id: "2", value: "Overdue"},
			{id: "3", value: "Completed"},
			{id: "4", value: "Today"},
			{id: "5", value: "Tomorrow"},
			{id: "6", value: "This week"},
			{id: "7", value: "This month"}
		];

		return {
			rows: [
				{cols: [
					{
						view: "segmented",
						value: 1,
						options: filterOptions,
						gravity: 4
					},
					{},
					{
						view: "button",
						localId: "add",
						label: "Add activity",
						type: "icon",
						icon: "wxi-plus-square",
						css: "webix_primary",
						click: () => {
							this.window.showWindow(null, "Add");
						}
					}
				]},
				{
					view: "datatable",
					localId: "activities",
					hover: "hoverLine",
					autoConfig: true,
					scrollX: false,
					select: true,
					columns: [
						{
							id: "State",
							header: "",
							template: "{common.checkbox()}",
							checkValue: "Close",
							uncheckValue: "Open",
							width: 50
						},
						{
							id: "TypeID",
							header: ["Activity type", {content: "richSelectFilter"}],
							options: activityTypes,
							sort: "string",
							width: 300
						},
						{
							id: "convertedDate",
							header: ["Due date", {content: "dateRangeFilter", inputConfig: {format: webix.i18n.longDateFormatStr}}],
							sort: "date",
							width: 200,
							format: webix.i18n.longDateFormatStr
						},
						{
							id: "Details",
							header: ["Details", {content: "multiComboFilter"}],
							template: "#Details#",
							fillspace: true,
							sort: "string"
						},
						{
							id: "ContactID",
							header: ["Contact", {content: "richSelectFilter"}],
							options: contacts,
							sort: "string",
							fillspace: true,
							width: 200
						},
						{
							id: "",
							width: 40,
							template: "{common.editIcon()}"
						},
						{
							id: "",
							template: "{common.trashIcon()}",
							width: 40
						}
					],
					onClick: {
						"wxi-trash": (e, id) => {
							webix.confirm({
								text: "Are you sure?",
								callback: (result) => {
									if (result) activities.remove(id);
								}
							});
							return false;
						},
						"wxi-pencil": (e, id) => {
							let item = activities.getItem(id);
							this.window.showWindow(item, "Edit");
							return false;
						}
					}
				}
			],
			type: "section"
		};
	}

	init() {
		activities.filter();
		this.$$("activities").sync(activities);
		this.window = this.ui(PopupView);
	}
}
