import {JetView} from "webix-jet";
import {activity} from "../models/activity";
import ActivitiesDataTable from "./activitiesElements/activitiesTable";
import ActivityForm from "./activitiesElements/activitiesForm";

export default class DataView extends JetView {
	config() {
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
									{id: 1, value: "All"},
									{id: 2, value: "Overdue"},
									{id: 3, value: "Completed"},
									{id: 4, value: "Today"},
									{id: 5, value: "Tomorrow"},
									{id: 6, value: "This week"},
									{id: 7, value: "This month"}
								]
						},
						{

							view: "button",
							type: "icon",
							icon: "wxi-plus-square",
							css: "webix_primary",
							label: "Add activity",
							autowidth: true,
							click: () => {
								this.app.callEvent("show:editWindow", [null]);
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
}
