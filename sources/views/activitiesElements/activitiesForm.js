import {JetView} from "webix-jet";
import {contacts} from "../../models/contacts";
import {activitytypes} from "../../models/activityType";
import {activity} from "../../models/activity";


export default class ActivityForm extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

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
						template: editType => `${editType} ${_("activity")}`,
						type: "header",
						css: "activities_form_header"
					},
					{
						view: "textarea",
						name: "Details",
						label: _("Details"),
						invalidMessage: "Please entry your name"
					},
					{
						view: "combo",
						name: "TypeID",
						label: _("Type"),
						options: activitytypes,
						invalidMessage: "Please select a type"
					},
					{
						view: "combo",
						name: "ContactID",
						label: _("Contact"),
						localId: "contactCombo",
						id: "ContactComboAct",
						options: contacts,
						invalidMessage: "Please select a contact"
					},
					{
						cols: [
							{
								view: "datepicker",
								name: "NewDate",
								label: _("Date"),
								invalidMessage: "Please select a date"
							},
							{
								view: "datepicker",
								value: "10:00",
								format: "%H:%i",
								type: "time",
								name: "NewTime",
								label: _("Time"),
								invalidMessage: "Please select any time"
							}
						]
					},
					{
						view: "checkbox",
						checkValue: "Close",
						uncheckValue: "Open",
						name: "State",
						labelRight: _("Completed")
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
							value: _("Cancel"),
							click: () => {
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
		const _ = this.app.getService("locale")._;
		this.form = view.getBody();

		this.on(this.app, "show:activitiesForm", (data, id) => {
			let mode = data ? `${_("Edit")}` : `${_("Add")}`;
			this.$$("changeValue").setValues(`${_(mode)}`);
			this.$$("activityButton").setValue(`${_(mode)}`);
			if (data) this.form.setValues(data);
			this.getRoot().show();

			const pages = this.getUrl();
			pages.forEach((page) => {
				if (page.page === "contactsElements.contactsProfile") {
					const contactCombo = this.$$("contactCombo");
					if (id) contactCombo.setValue(id);
					contactCombo.disable();
				}
			});
		});
	}

	hideForm() {
		this.form.clearValidation();
		this.form.clear();
		this.$$("myWindow").hide();
	}
}

