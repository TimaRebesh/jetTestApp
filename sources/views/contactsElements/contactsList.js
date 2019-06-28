import {JetView} from "webix-jet";
import {contacts} from "../../models/contacts";

export default class ContactsView extends JetView {
	config() {
		return {
			view: "list",
			localId: "Contactslist",
			width: 300,
			select: true,
			type: {
				template: obj => `
				<image class="userphoto" src="${obj.Photo || "http://confirent.ru/sites/all/themes/skeletontheme/images/empty_avatar.jpg"}" />
				<div class="userinfo">
					<span class="username">${obj.FirstName} ${obj.LastName}</span>
					<span class="userjob">${obj.Job || " "}</span>
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
	}

	init(view) {
		view.sync(contacts);

		contacts.waitData.then(() => {
			let list = this.$$("Contactslist");
			let id = this.getParam("id");

			if (!id || !contacts.exists(id)) { id = contacts.getFirstId(); }
			if (id) { list.select(id); }
		});
	}
}
