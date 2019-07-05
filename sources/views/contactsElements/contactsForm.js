import {JetView} from "webix-jet";
import {contacts} from "../../models/contacts";
import {statuses} from "../../models/statuses";


webix.protoUI({
	name: "template2",
	$allowsClear: true,
	getValue() {
		return this.getValues();
	},
	setValue(value) {
		this.setValues(value);
	}
}, webix.ui.template);

const defaultPhoto = "http://confirent.ru/sites/all/themes/skeletontheme/images/empty_avatar.jpg";

export default class ContactsForm extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		return {
			rows: [
				{
					template: "Edit (add new) contact",
					localId: "formHeader",
					height: 50,
					borderless: true
				},
				{cols: [
					{
						view: "form",
						localId: "editContact",
						borderless: true,
						elementsConfig: {
							labelWidth: 150
						},
						rules: {
							FirstName: webix.rules.isNotEmpty,
							LastName: webix.rules.isNotEmpty,
							StartDate: webix.rules.isNotEmpty,
							birthDate: webix.rules.isNotEmpty
						},
						cols: [
							{rows: [
								{
									view: "text",
									label: _("First name"),
									name: "FirstName"
								},
								{
									view: "text",
									label: _("Last name"),
									name: "LastName"
								},
								{
									view: "datepicker",
									label: _("Joining date"),
									name: "StartDate",
									format: webix.i18n.longDateFormatStr,
									invalidMessage: "Please select a date"
								},
								{
									view: "richselect",
									label: _("Status"),
									name: "StatusID",
									options: statuses
								},
								{
									view: "text",
									label: _("Job"),
									name: "Job"
								},
								{
									view: "text",
									label: _("Company"),
									name: "Company"
								},
								{
									view: "text",
									label: _("Website"),
									name: "Website",
									placeholder: "some website"
								},
								{
									view: "text",
									label: _("Address"),
									name: "Address"
								},
								{}
							],
							margin: 20
							},
							{gravity: 0.2},
							{rows: [
								{
									view: "text",
									label: "Email",
									name: "Email"
								},
								{
									view: "text",
									label: "Skype",
									name: "Skype"
								},
								{
									view: "text",
									label: _("Phone"),
									name: "Phone"
								},
								{
									view: "datepicker",
									label: _("Birthday"),
									name: "birthDate",
									format: webix.i18n.longDateFormatStr,
									invalidMessage: "Please select a date"
								},
								{
									cols: [
										{
											template: obj => `<img class="bigphoto" src=${obj} width=200 height=200></img>`,
											view: "template2",
											localId: "photoPreview",
											name: "Photo",
											width: 250,
											height: 250,
											borderless: true
										},
										{
											margin: 10,
											rows: [
												{},
												{
													view: "uploader",
													value: _("Change photo"),
													accept: "image/jpeg, image/png",
													multiple: "false",
													on: {
														onBeforeFileAdd: (img) => {
															let reader = new FileReader();
															reader.onload = (event) => {
																this.$$("photoPreview").setValues(event.target.result);
															};
															reader.readAsDataURL(img.file);
															return false;
														}
													}
												},
												{
													view: "button",
													value: _("Delete photo"),
													click: () => {
														let item = contacts.getItem(this.getParam("id"));
														this.$$("photoPreview").setValues(defaultPhoto);
														item.Photo = "";
													}
												},
												{gravity: 0.3}
											]
										}
									]
								},
								{}
							],
							margin: 20
							}
						]
					}
				]
				},
				{cols: [
					{},
					{
						view: "button",
						value: _("Cancel"),
						click: () => {
							this.closeForm();
						}
					},
					{
						view: "button",
						value: _("Save(add)"),
						localId: "saveContact",
						css: "webix_primary",
						click: () => {
							this.addNewContact();
						}
					}
				]}
			]
		};
	}

	init() {
		let updateButton = this.$$("saveContact");
		let formHeader = this.$$("formHeader");

		this.on(this.app, "addContact", (item, mode) => {
			formHeader.setHTML(`<h2>${mode} new contact</h2>`);
			updateButton.setValue(`${mode}`);
			this.$$("editContact").setValues({FirstName: "New", LastName: "User", StatusID: 1});
		});

		this.on(this.app, "editContact", (item, mode) => {
			formHeader.setHTML(`<h2>${mode} contact</h2>`);
			updateButton.setValue("Save");
			this.$$("editContact").setValues(item);
		});
	}

	urlChange() {
		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		]).then(() => {
			let id = this.getParam("id");
			let item = contacts.getItem(id);
			this.$$("photoPreview").setValues(defaultPhoto);
			this.$$("editContact").setValues(item);
		});
	}

	// urlChange() {
	// 	webix.promise.all([
	// 		contacts.waitData,
	// 		statuses.waitData
	// 	]).then(
	// 		() => {
	// 			const mode = this.getParam("mode", true);
	// 			const contactPhoto = this.$$("photoPreview");
	// 			if (mode === "Add") {
	// 				contactPhoto.setValues({Photo: "http://confirent.ru/sites/all/themes/skeletontheme/images/empty_avatar.jpg"});
	// 			}
	// 			if (mode === "Edit") {
	// 				contactPhoto.setValues({Photo: contacts.Photo});
	// 			}
	// 		}
	// 	);
	// }


	closeForm() {
		let form = this.$$("editContact");
		let value = this.$$("saveContact").getValue();
		if (value === "Add") {
			contacts.remove(contacts.getLastId());
		}
		webix.$$("top:contactsInfo").show(false, false);
		form.clear();
		form.clearValidation();
	}

	addNewContact() {
		let id = this.getParam("id");
		let form = this.$$("editContact");
		let value = form.getValues();
		if (form.validate()) {
			value.Photo = this.$$("photoPreview").getValues();
			if (contacts.exists(id)) {
				contacts.updateItem(id, value);
			}
			webix.message("Entry successfully saved");
			webix.$$("top:contactsInfo").show(false, false);
			form.clearValidation();
			form.clear();
		}
	}
}
