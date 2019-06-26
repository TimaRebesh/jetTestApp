import {JetView} from "webix-jet";
import {contacts} from "../../models/contacts";
import {activitytypes} from "../../models/activityType";
import {activity} from "../../models/activity";


export default class ActivityForm extends JetView {
	config() {
		return {
			view: "window",
			localId: "myWindow",
			head: false,
			position: "center",
			modal: true,
			body: {
				view: "form",
				localId: "activityform",
				width: 600,
				elements: [
					{
						view: "template",
						template: "Add (*edit) activity",
						type: "header",
						css: "activities_form_header"
					},
					{
						view: "textarea",
						name: "Details",
						label: "Details",
						invalidMessage: "Please entry your name"
					},
					{
						view: "combo",
						name: "TypeID",
						label: "Type",
						options: activitytypes,
						invalidMessage: "Please select a type"
					},
					{
						view: "richselect",
						name: "ContactID",
						label: "Contact",
						options: contacts,
						invalidMessage: "Please select a contact"
					},
					{
						cols: [
							{
								view: "datepicker",
								name: "NewDate",
								label: "Date",
								invalidMessage: "Please select a date"
							},
							{
								view: "datepicker",
								value: "10:00",
								type: "time",
								name: "NewTime",
								label: "Time",
								invalidMessage: "Please select any time"
							}
						]
					},
					{
						view: "checkbox",
						name: "State",
						labelRight: "Completed"
					},
					{cols: [
						{gravity: 2},
						{
							view: "button",
							value: "Add (*save)",
							type: "form",
							css: "webix_primary",
							click: () => {
								const activityform = this.$$("activityform");
								let value = activityform.getValues();
								activityform.clearValidation();
								if (activityform.validate()) {
									if (value.id) {
										activity.updateItem(value.id, value);
									}
									else {
										activity.add(value);
									}
									this.$$("myWindow").hide();
								}
							}
						},
						{
							view: "button",
							value: "Cancel",
							click: () => {
								this.$$("myWindow").hide();
							}
						}
					]},
					{}
				],
				rules: {
					$all: webix.rules.isNotEmpty
				}
			}
		};
	}

	init(view) {
		this.form = view.getBody();

		this.on(this.app, "form:fill", (values) => {
			view.show();
			this.form.setValues(values);
		});
	}

	showForm() {
		this.getRoot().show();
	}

	hideForm() {
		this.getRoot().hide();
		this.form.clear();
		this.form.clearValidation();
	}

	urlChange() {
		webix.promise.all([
			activitytypes.waitData,
			contacts.waitData
		]);
	}
}
