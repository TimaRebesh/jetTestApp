import {JetView} from "webix-jet";
import ContactsList from "./contactsElements/contactsList";

export default class ContactsView extends JetView {
	config() {
		return {
			cols: [
				ContactsList,
				{$subview: true}
			]
		};
	}

	init() {
		this.show("contactsElements.contactsProfile");
		this.on(this.app, "contact:switch", (id) => {
			this.setParam("id", id, true);
		});
		this.on(this.app, "contact:return", (id) => {
			this.setParam("id", id, true);
			this.show("contactsElements.contactsProfile");
		});
	}

	showForm() {
		this.show("contactsElements.contactsForm").then(() => {

		});
	}
}

