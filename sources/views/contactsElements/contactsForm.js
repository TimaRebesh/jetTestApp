import {JetView} from "webix-jet";
import {contacts} from "../../models/contacts";
import {statuses} from "../../models/statuses";

webix.protoUI({
	name: "photoTemplate",
	$allowsClear: true,
	getValue() {
		let value = this.getValues();
		return value.data;
	},
	setValue(value) {
		this.setValues({data: value});
	}
}, webix.ui.template);

const defaultPhoto = "http://confirent.ru/sites/all/themes/skeletontheme/images/empty_avatar.jpg";

export default class ContactsForm extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		return {
			view: "form",
			localId: "contactUserForm",
			id: "contact:form",
			elementsConfig: {
				labelWidth: 150,
				margin: 20
			},
			rules: {
				FirstName: webix.rules.isNotEmpty,
				LastName: webix.rules.isNotEmpty,
				StatusID: webix.rules.isNotEmpty,
				Job: webix.rules.isNotEmpty
			},
			elements: [
				{
					type: "header",
					localId: "headName",
					template: obj => obj.value,
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
									label: _("First name"),
									placeholder: "first name",
									invalidMessage: "fill in the field please"
								},
								{
									view: "text",
									name: "LastName",
									label: _("Last name"),
									placeholder: "last name",
									invalidMessage: "fill in the field please"
								},
								{
									view: "datepicker",
									name: "StartDate",
									label: _("Joining date")
								},
								{
									view: "combo",
									name: "StatusID",
									label: _("Status"),
									options: statuses,
									invalidMessage: "fill in the field please"
								},
								{
									view: "text",
									name: "Job",
									label: _("Job"),
									placeholder: "job",
									invalidMessage: "fill in the field please"
								},
								{
									view: "text",
									name: "Company",
									label: _("Company"),
									placeholder: "company",
									invalidMessage: "fill in the field please"
								},
								{
									view: "text",
									name: "Website",
									label: _("Website"),
									placeholder: "some website"
								},
								{
									view: "text",
									name: "Address",
									label: _("Address"),
									placeholder: "address"
								}
							]
						},
						{gravity: 0.2},
						{
							rows: [
								{
									view: "text",
									name: "Email",
									label: _("Email"),
									placeholder: "email"
								},
								{
									view: "text",
									name: "Skype",
									label: _("Skype"),
									placeholder: "some Skype"
								},
								{
									view: "text",
									name: "Phone",
									label: _("Phone"),
									placeholder: "phone number"
								},
								{
									view: "datepicker",
									name: "Birthday",
									label: _("Birthday"),
									invalidMessage: "Please select a date"
								},
								{

									cols: [
										{
											view: "photoTemplate",
											name: "Photo",
											borderless: true,
											localId: "photoPreview",
											template: (obj) => {
												let photoStr = obj.data || defaultPhoto;
												return `<image class="userphoto2" src="${photoStr}" />`;
											}

										},
										{
											rows: [
												{},
												{
													view: "uploader",
													value: _("Change photo"),
													accept: "image/jpeg, image/png",
													autosend: false,
													multiple: false,
													on: {
														onBeforeFileAdd: (upload) => {
															const file = upload.file;
															const reader = new FileReader();
															reader.onload = (event) => {
																this.photo = event.target.result;
																this.$$("photoPreview").setValue(this.photo);
															};
															reader.readAsDataURL(file);
															return false;
														}
													}
												},
												{
													view: "button",
													value: _("Delete photo"),
													click: () => {
														this.$$("photoPreview").setValues(defaultPhoto);
													}
												},
												{gravity: 0.3}
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
							value: _("Cancel"),
							click: () => {
								this.closeForm();
							}
						},
						{
							view: "button",
							type: "form",
							value: _("Add"),
							id: "save:contactform",
							click: () => {
								const contactForm = this.$$("contactUserForm");
								if (contactForm.validate()) {
									this.addNewContact();
								}
							}

						}
					]
				}
			]
		};
	}

	init() {
		this.form = this.$$("contactUserForm");
		const contactId = this.getParam("id", true);
		contacts.waitData.then(() => {
			if (contactId && contacts.exists(contactId)) {
				const photo = contacts.getItem(contactId).Photo;
				this.photo = photo;
			}
		});
	}

	urlChange() {
		const _ = this.app.getService("locale")._;

		let form = this.$$("contactUserForm");
		const id = this.getParam("id", true);
		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		]).then(() => {
			const values = contacts.getItem(id);
			if (values) { form.setValues(values, true); }

			const mode = this.getParam("mode", true);

			if (mode) {
				this.$$("headName").setValues({value: `${mode} ${_("contact")}`});

				if (mode === _("Add")) {
					this.$$("contactUserForm").setValues({});
					this.$$("save:contactform").setValue(mode);
				}
				if (mode === _("Edit")) {
					this.$$("save:contactform").setValue(mode);
				}
			}
		});
	}

	addNewContact() {
		const values = this.$$("contactUserForm").getValues();
		const id = values.id;
		contacts.waitSave(() => {
			if (id) {
				contacts.updateItem(id, values);
			}
			else {
				contacts.add(values);
			}
		}).then((obj) => {
			this.closeForm(obj.id);
		});
	}


	closeForm(id) {
		let param = id || this.getParam("id", true);
		this.app.callEvent("contact:switch", [param]);
		this.form = "";
	}
}
