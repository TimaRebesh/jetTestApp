import {JetView} from "webix-jet";
import ContactsList from "./contactsElements/contactsList";
import ContactsProfile from "./contactsElements/contactsProfile";

export default class ContactsView extends JetView {
	config() {
		return {
			cols: [
				ContactsList,
				ContactsProfile
			]
		};
	}
}

