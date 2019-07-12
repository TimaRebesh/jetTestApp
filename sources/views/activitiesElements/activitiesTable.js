import {JetView} from "webix-jet";
import {activity} from "../../models/activity";
import {activitytypes} from "../../models/activityType";
import {contacts} from "../../models/contacts";
import {statuses} from "../../models/statuses";

export default class ActivitiesDataTable extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		return {
			view: "datatable",
			localId: "activities",
			id: "activitiesDataTable",
			hover: "hoverLine",
			autoConfig: true,
			scrollX: false,
			select: true,
			columns: [
				{
					header: "",
					id: "State",
					template: "{common.checkbox()}",
					checkValue: "Close",
					uncheckValue: "Open",
					width: 50
				},
				{
					header: [_("Activity type"), {content: "selectFilter"}],
					id: "TypeID",
					editor: "select",
					options: activitytypes,
					sort: "string",
					width: 300
				},
				{
					header: [_("Due date"), {content: "datepickerFilter", inputConfig: {format: webix.i18n.longDateFormatStr}}],
					id: "NewDate",
					format: webix.i18n.longDateFormatStr,
					sort: "date",
					width: 200
				},
				{
					header: [_("Details"), {content: "textFilter"}],
					id: "Details",
					fillspace: true,
					sort: "string"
				},
				{
					header: [_("Contact"), {content: "selectFilter"}],
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
			onClick: {
				"wxi-trash": (e, id) => {
					webix.confirm({
						text: _("Are you sure?"),
						ok: _("OK"),
						cancel: _("Cancel"),
						callback: (result) => {
							if (result) activity.remove(id);
						}
					});
					return false;
				},
				"wxi-pencil": (e, id) => {
					const item = this.getRoot().getItem(id);
					this.app.callEvent("show:activitiesForm", [item]);
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
				this.$$("activities").sync(activity);
			}
		);
	}
}
