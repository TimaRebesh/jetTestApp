import {JetView} from "webix-jet";
import {contacts} from "../../models/contacts";

export default class ContactsView extends JetView {
	config() {
		const list = {
			view: "list",
			localId: "Contactslist",
			width: 300,
			select: true,
			type: {
				template: obj => `
				<image class="userphoto" src="${obj.Photo}" />
				<div class="userinfo">
					<span class="username">${obj.FirstName} ${obj.LastName}</span>
					<span class="userjob">${obj.Job}</span>
				</div>
				`,
				height: 70
			},
			on: {
				onAfterSelect: (id) => {
					this.show(`../contacts?id=${id}`);
				}
			}
		};

		const buttonList = {
			view: "button",
			label: "Add contact",
			type: "icon",
			icon: "wxi-plus",
			anchoralign: "center"
		};

		const ui = {
			rows: [
				list,
				buttonList
			]
		};

		return ui;
	}

	init() {
		this.$$("Contactslist").sync(contacts);

		contacts.waitData.then(() => {
			let list = this.$$("Contactslist");
			let id = this.getParam("id");

			if (!id || !contacts.exists(id)) { id = contacts.getFirstId(); }
			if (id) { list.select(id); }
		});
	}
}
