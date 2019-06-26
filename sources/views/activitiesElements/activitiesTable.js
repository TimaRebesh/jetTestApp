import {JetView} from "webix-jet";
import {activity} from "../../models/activity";
import {activitytypes} from "../../models/activityType";
import {contacts} from "../../models/contacts";
import {statuses} from "../../models/statuses";

export default class ActivitiesDataTable extends JetView {
	config() {
		return {
			view: "datatable",
			localId: "activities",
			hover: "hoverLine",
			autoConfig: true,
			scrollX: false,
			select: true,
			columns: [
				{
					header: "",
					id: "State",
					template: "{common.checkbox()}",
					width: 50
				},
				{
					header: ["Activity type", {content: "selectFilter"}],
					id: "TypeID",
					editor: "select",
					options: activitytypes,
					sort: "string",
					width: 300
				},
				{
					header: ["Due date", {content: "dateRangeFilter"}],
					id: "NewDate",
					format: webix.i18n.longDateFormatStr,
					sort: "date",
					width: 200
				},
				{
					header: ["Details", {content: "textFilter"}],
					id: "Details",
					fillspace: true,
					sort: "string"
				},
				{
					header: ["Contact", {content: "selectFilter"}],
					id: "ContactID",
					sort: "string",
					options: contacts,
					width: 200
				},
				{
					id: "",
					template: "{common.editIcon()}",
					width: 40
				},
				{
					id: "",
					template: "{common.trashIcon()}",
					width: 40
				}
			],
			on: {
				onAfterSelect: (id) => {
					this.show(`../activities?id=${id}`);
				}
			},
			onClick: {
				"wxi-trash": (e, id) => {
					webix.confirm({
						text: "Are you sure?",
						callback: (res) => {
							if (res) this.app.callEvent("activity:delete", [id.row]);
						}
					});
				},
				"wxi-pencil": (e, id) => {
					const item = this.getRoot().getItem(id);
					this.app.callEvent("form:fill", [item]);
				}
			}
		};
	}

	init() {
		webix.promise.all([
			activity.waitData,
			contacts.waitData,
			activitytypes.waitData,
			statuses.waitData
		]).then(
			() => {
				this.$$("activities").parse(activity);
			}
		);
	}
}
