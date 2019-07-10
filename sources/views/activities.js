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
									{id: 1, value: _("All")},
									{id: 2, value: _("Overdue")},
									{id: 3, value: _("Completed")},
									{id: 4, value: _("Today")},
									{id: 5, value: _("Tomorrow")},
									{id: 6, value: _("This week")},
									{id: 7, value: _("This month")}
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

		webix.promise.all([
			activity.waitData
		]).then(() => {
			activity.data.filter();

			function getDates() {
				let now = new Date();
				let dates = {};
				dates.currentDay = webix.Date.datePart(now);
				dates.tomorrow = webix.Date.add(dates.currentDay, 1, "day", true);
				dates.startCurrentWeek = webix.Date.weekStart(dates.currentDay);
				dates.startCurrentMonth = webix.Date.monthStart(dates.currentDay);
				return dates;
			}
			const dates = getDates();
			webix.$$("activitiesDataTable").registerFilter(
				webix.$$("tabbar"), {
					columnId: "State",
					compare: (value, filter, item) => {
						let filterData = parseInt(filter);
						let state = item.State;
						let date = item.NewDate;
						let DateDay = webix.Date.datePart(date, true);
						let startWeek = webix.Date.weekStart(DateDay);
						let startMonth = webix.Date.monthStart(DateDay);

						if (filterData === 1) return item;
						else if (filterData === 2) {
							return state === "Open" && date < new Date();
						}
						else if (filterData === 3) return state === "Close";
						else if (filterData === 4) {
							return webix.Date.equal(dates.currentDay, DateDay) && state === "Open";
						}
						else if (filterData === 5) {
							return webix.Date.equal(dates.tomorrow, DateDay) && state === "Open";
						}
						else if (filterData === 6) {
							return webix.Date.equal(dates.startCurrentWeek, startWeek) && state === "Open";
						}
						return webix.Date.equal(dates.startCurrentMonth, startMonth) && state === "Open";
					}
				}, {
					getValue: node => node.getValue(),
					setValue: (node, value) => {
						node.setValue(value);
					}
				}
			);
		});
	}
}
