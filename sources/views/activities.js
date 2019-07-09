import {JetView} from "webix-jet";
import {activity} from "../models/activity";
import ActivitiesDataTable from "./activitiesElements/activitiesTable";
import ActivityForm from "./activitiesElements/activitiesForm";

export default class DataView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		return {
			rows: [
				{
					cols: [
						{
							view: "tabbar",
							id: "tabbar",
							autodidth: true,
							options:
								[
									{id: "1", value: _("All")},
									{id: "2", value: _("Overdue")},
									{id: "3", value: _("Completed")},
									{id: "4", value: _("Today")},
									{id: "5", value: _("Tomorrow")},
									{id: "6", value: _("This week")},
									{id: "7", value: _("This month")}
								],
							on: {
								onChange: () => {
									webix.$$("activitiesDataTable").filterByAll();
								}
							}
						},
						{

							view: "button",
							type: "icon",
							icon: "wxi-plus-square",
							css: "webix_primary",
							label: "Add activity",
							autowidth: true,
							click: () => {
								this.app.callEvent("show:activitiesForm", [null]);
							}

						}]
				},
				{$subview: ActivitiesDataTable}
			]
		};
	}

	init() {
		this.form = this.ui(ActivityForm);

		this.on(this.app, "activity:save", (values) => {
			if (values.id) {
				activity.updateItem(values.id, values);
			}
			else { activity.add(values); }
		});

		this.on(this.app, "activity:delete", id => activity.remove(id));

		activity.waitData.then(() => {
			activity.data.filter();
		});
	}

	// filterOfActivities(view) {
	// 	view.registerFilter(
	// 		this.$$("tabbar"), {
	// 			columnId: "State",
	// 			compare: (value, filter, item)	=> {
	// 				const today = new Date();
	// 			}
	// 		}
	// 	);
	// }
}
