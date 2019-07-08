import {JetView} from "webix-jet";
import {activity} from "../../models/activity";
import ActivitiesDataTable from "../activitiesElements/activitiesTable";
import ActivityForm from "../activitiesElements/activitiesForm";

export default class ContactTable extends JetView {
	config() {
		return {
			rows: [
				{$subview: ActivitiesDataTable},
				{
					view: "toolbar",
					elements: [
						{},
						{
							view: "button",
							label: "Add activity",
							localId: "addActivButton",
							type: "icon",
							value: "Add",
							icon: "wxi-plus",
							css: "webix_primary",
							align: "right",
							inputWidth: 200,
							click: () => {
								let id = this.getParam("id", true);
								this.app.callEvent("show:activitiesForm", [null, id]);
							}
						}
					]
				}
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
	}
}
