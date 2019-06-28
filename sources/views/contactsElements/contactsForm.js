import {JetView} from "webix-jet";
import {contacts} from "../../models/contacts";
import {statuses} from "../../models/statuses";


export default class ContactsForm extends JetView {
	config() {
		return {
			view: "form",
			localId: "contactUserForm",
			// borderless: true,
			elementsConfig: {
				labelWidth: 150
			},
			rules: {
				$all: webix.rules.isNotEmpty
			},
			elements: [
				{
					view: "label",
					template: "Edit (*add new) contact",
					css: "contact_form_header",
					height: 40
				},
				{
					cols: [
						{
							rows: [
								{
									view: "text",
									name: "FirstName",
									label: "First name"
								},
								{
									view: "text",
									name: "LastName",
									label: "Last name"
								},
								{
									view: "datepicker",
									name: "NewDate",
									label: "Joining date"
								},
								{
									view: "richselect",
									name: "statusID",
									label: "Status",
									options: statuses
								},
								{
									view: "text",
									name: "Job",
									label: "Job"
								},
								{
									view: "text",
									name: "Company",
									label: "Company"
								},
								{
									view: "text",
									name: "Webside",
									label: "Webside"
								},
								{
									view: "text",
									name: "Address",
									label: "Address"
								}
							]
						},
						{gravity: 0.2},
						{
							rows: [
								{
									view: "text",
									name: "Email",
									label: "Email"
								},
								{
									view: "text",
									name: "Skype",
									label: "Skype"
								},
								{
									view: "text",
									name: "Phone",
									label: "Phone"
								},
								{
									view: "datepicker",
									name: "NewDate",
									label: "Birthday",
									invalidMessage: "Please select a date"
								},
								{

									cols: [
										{
											view: "template",
											borderless: true,
											localId: "photo",
											template: obj => `
               							    	 <image class="userphoto2" src="${obj.Photo ? obj.Photo : "https://"}" />
                							`
										},
										{
											rows: [
												{},
												{
													view: "button",
													type: "form",
													value: "Change photo",
													tooltip: "Click to change the photo"
												},
												{
													view: "button",
													type: "form",
													value: "Delete photo"
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{},
				{
					cols: [
						{gravity: 4},
						{
							view: "button",
							type: "form",
							value: "Cancel"
						},
						{
							view: "button",
							type: "form",
							value: "Save(*add)"
						}
					]
				}
			]
		};
	}

	urlChange() {
		let form = this.$$("contactUserForm");
		const id = this.getParentView().getSelected();
		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		]).then(() => {
			const values = contacts.getItem(id);
			if (values) { form.setValues(values); }
		});
	}
}
