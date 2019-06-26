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
							css: "webix_primary",
							icon: "wxi-plus-square",
							label: "Add activity",
							autowidth: true,
							click: () => {
								this.form.showForm();
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
			// eslint-disable-next-line no-unused-expressions
			values.id ? activity.updateItem(values.id, values) : activity.add(values);
		});

		this.on(this.app, "activity:delete", id => activity.remove(id));
	}
}
