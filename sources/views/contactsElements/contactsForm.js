import {JetView} from "webix-jet";
import {contacts} from "../../models/contacts";
import {statuses} from "../../models/statuses";

webix.protoUI({
	name: "photpTemplate",
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
									label: "First name",
									placeholder: "first name",
									invalidMessage: "fill in the field please"
								},
								{
									view: "text",
									name: "LastName",
									label: "Last name",
									placeholder: "last name",
									invalidMessage: "fill in the field please"
								},
								{
									view: "datepicker",
									name: "StartDate",
									label: "Joining date"
								},
								{
									view: "combo",
									name: "StatusID",
									label: "Status",
									options: statuses,
									invalidMessage: "fill in the field please"
								},
								{
									view: "text",
									name: "Job",
									label: "Job",
									placeholder: "job",
									invalidMessage: "fill in the field please"
								},
								{
									view: "text",
									name: "Company",
									label: "Company",
									placeholder: "company",
									invalidMessage: "fill in the field please"
								},
								{
									view: "text",
									name: "Webside",
									label: "Webside",
									placeholder: "some website"
								},
								{
									view: "text",
									name: "Address",
									label: "Address",
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
									label: "Email",
									placeholder: "email"
								},
								{
									view: "text",
									name: "Skype",
									label: "Skype",
									placeholder: "some Skype"
								},
								{
									view: "text",
									name: "Phone",
									label: "Phone",
									placeholder: "phone number"
								},
								{
									view: "datepicker",
									name: "Birthday",
									label: "Birthday",
									invalidMessage: "Please select a date"
								},
								{

									cols: [
										{
											view: "photpTemplate",
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
													value: "Change photo",
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
													value: "Delete photo",
													click: () => {
														this.photo = "";
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
							value: "Cancel",
							click: () => {
								this.closeForm();
							}
						},
						{
							view: "button",
							type: "form",
							value: "Add",
							id: "save:contactform",
							click: () => {
								const contactForm = this.$$("contactUserForm");
								if (contactForm.validate()) {
									this.addNewContact();
									this.closeForm();
								}
							}

						}
					]
				}
			]
		};
	}

	init() {
		this.contactList = webix.$$("contacts:list");
		this.form = this.$$("contactUserForm");
		const id = this.getParam("id", true);
		contacts.waitData.then(() => {
			if (id && contacts.exists(id)) {
				const photo = contacts.getItem(id).Photo;
				this.photo = photo;
			}
		});
	}

	urlChange() {
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
				this.$$("headName").setValues({value: `${mode} contact`});

				if (mode === "Add") {
					this.$$("photoPreview").setValues({Photo: defaultPhoto});
					this.$$("contactUserForm").setValues({});
					this.$$("save:contactform").setValue(mode);
				}
				if (mode === "Edit") {
					this.$$("save:contactform").setValue(mode);
				}
			}
		});
	}

	addNewContact() {
		const values = this.$$("contactUserForm").getValues();
		const id = values.id;
		this.newID = contacts.getLastId();
		contacts.waitSave(() => {
			if (id) {
				contacts.updateItem(id, values);
			}
			else {
				contacts.add(values);
			}
		});
	}


	closeForm() {
		const id = this.getParam("id", true);
		this.app.callEvent("contact:switch", [id]);
		this.form = "";
	}
}
