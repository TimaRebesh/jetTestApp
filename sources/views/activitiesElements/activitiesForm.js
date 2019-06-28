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
						id: "changeValue",
						template: obj => obj.value,
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
								format: "%H:%i",
								type: "time",
								name: "NewTime",
								label: "Time",
								invalidMessage: "Please select any time"
							}
						]
					},
					{
						view: "checkbox",
						checkValue: "open",
						uncheckValue: "close",
						name: "State",
						labelRight: "Completed"
					},
					{cols: [
						{gravity: 2},
						{
							view: "button",
							localId: "activityButton",
							type: "form",
							css: "webix_primary",
							click: () => {
								const activityform = this.$$("activityform");
								let value = activityform.getValues();
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
								this.hideForm();
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
			this.showForm({}, "Save");
			this.form.setValues(values);
		});
	}

	showForm(data, type) {
		this.getRoot().show();
		this.$$("changeValue").setValues({value: `${type} activity`});
		this.$$("activityButton").setValue(type);
	}

	hideForm() {
		this.form.clear();
	}
}
