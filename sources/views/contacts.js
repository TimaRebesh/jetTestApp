import {JetView} from "webix-jet";
import {contacts} from "../models/contacts";
import ContactInfo from "./contactsElements/contactsProfile";
import ContactsForm from "./contactsElements/contactsForm";

export default class ContactsView extends JetView {
	config() {
		const defaultPhoto = "http://confirent.ru/sites/all/themes/skeletontheme/images/empty_avatar.jpg";

		const contactsFilter = {
			view: "text",
			localId: "inputFilter",
			height: 50,
			placeholder: "type to find matching contact",
			on: {
				onTimedKeyPress: () => {
					let value = this.$$("inputFilter").getValue().toLowerCase();
					this.$$("Contactslist").filter((obj) => {
						let fullName = [obj.FirstName, obj.LastName].join(" ");
						let lastName = obj.LastName.toLowerCase().indexOf(value);
						let company = obj.Company.toLowerCase().indexOf(value);
						fullName = fullName.toString().toLowerCase().indexOf(value);
						return fullName !== -1 || lastName !== -1 || company !== -1;
					});
				}
			}
		};

		const contactsList = {
			view: "list",
			localId: "Contactslist",
			width: 300,
			select: true,
			scroll: "auto",
			template: obj => `
				<image class="userphoto" src="${obj.Photo || defaultPhoto}" />
				<div class="userinfo">
					<span class="username">${obj.FirstName} ${obj.LastName}</span>
					<span class="userjob">${obj.Company || " "}</span>
				</div>
				`,
			type: {
				width: "auto",
				height: 70
			},
			on: {
				onAfterSelect: (id) => {
					this.setParam("id", id, true);
				}
			}
		};

		const buttonList = {
			view: "button",
			type: "icon",
			icon: "mdi mdi-plus-box",
			label: "Add contact",
			css: "webix_primary",
			click: () => {
				contacts.add({FirstName: "New", LastName: "User", StatusID: 1});
				this.app.callEvent("addContact", [null, "Add"]);
				webix.$$("top:contactsForm").show(false, false);
			}
		};

		return {
			cols: [
				{
					rows: [
						contactsFilter,
						contactsList,
						buttonList
					]
				},
				{cells: [
					{$subview: ContactInfo, id: "top:contactsInfo"},
					{$subview: ContactsForm, id: "top:contactsForm"}
				]
				}
			],
			type: "section"
		};
	}

	init() {
		let contactsList = this.$$("Contactslist");

		contactsList.sync(contacts);

		contacts.waitData.then(() => {
			let id = this.getParam("id");

			contactsList.data.attachEvent("onIdChange", () => {
				contactsList.select(contacts.getLastId());
			});

			contacts.attachEvent("onAfterDelete", () => {
				contactsList.select(contacts.getFirstId());
			});

			if (!contacts.exists(id)) {
				contactsList.select(contacts.getFirstId());
			}
			else if (id && id !== contactsList.getSelectedId()) {
				contactsList.select(id);
			}

			const defaultPhoto = "http://confirent.ru/sites/all/themes/skeletontheme/images/empty_avatar.jpg";
			this.$$("photoPreview").setValues(defaultPhoto);
		});
	}
}

