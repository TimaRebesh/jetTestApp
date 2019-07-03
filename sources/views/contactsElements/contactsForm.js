import {JetView} from "webix-jet";
import {contacts} from "../../models/contacts";
import {statuses} from "../../models/statuses";


export default class ContactsForm extends JetView {
	config() {
		return {
			view: "form",
			localId: "contactUserForm",
			id: "contact:form",
			elementsConfig: {
				labelWidth: 150
			},
			rules: {
				$all: webix.rules.isNotEmpty
			},
			elements: [
				{
					view: "label",
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
									placeholder: "first name"
								},
								{
									view: "text",
									name: "LastName",
									label: "Last name",
									placeholder: "last name"
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
									options: statuses
								},
								{
									view: "text",
									name: "Job",
									label: "Job",
									placeholder: "job"
								},
								{
									view: "text",
									name: "Company",
									label: "Company",
									placeholder: "company"
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
											view: "template",
											name: "Photo",
											borderless: true,
											localId: "photo",
											id: "photo:contact",
											template: obj => `
               							    	 <image class="userphoto2" src="${obj.Photo ? obj.Photo : "http://confirent.ru/sites/all/themes/skeletontheme/images/empty_avatar.jpg"}" />
                							`
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
															let file = upload.file;
															let reader = new FileReader();
															reader.onload = (event) => {
																this.photo = event.target.result;
																webix.$$("photo:contact").setValues({Photo: this.photo});
															};
															reader.readAsDataURL(file);
															return false;
														}
													}
												},
												{
													view: "button",
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
								this.addNewContact();
								this.closeForm();
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
		});
	}

	addNewContact() {
		this.contactList = webix.$$("contacts:list");
		const values = this.form.getValues();
		const id = values.id;
		this.newID = contacts.getLastId();
		if (contacts.exists(id)) {
			values.Photo = this.photo;
			contacts.updateItem(id, values);
			this.contactsList.select(id);
		}
		else {
			contacts.add(values);
			values.Photo = this.photo;
			this.contactList.select(contacts.getLastId());
		}
	}


	closeForm() {
		const id = this.getParam("id", true);
		this.app.callEvent("contact:return", [id]);
		this.form = "";
	}
}
