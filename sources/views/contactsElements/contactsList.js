import {JetView} from "webix-jet";
import {contacts} from "../../models/contacts";
// import {activity} from "../../models/activity";

export default class ContactsView extends JetView {
	config() {
		const list = {
			view: "list",
			localId: "Contactslist",
			id: "contacts:list",
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
					this.app.callEvent("contact:switch", [id]);
				}
			}
		};

		const buttonList = {
			view: "button",
			label: "Add contact",
			localId: "buttonAddList",
			type: "icon",
			icon: "wxi-plus",
			value: "Add",
			anchoralign: "center",
			scrol: "auto",
			click: () => {
				// this.$$("Contactslist").unselect();
				// this.show("../contacts");

				this.getParentView().showForm();
				this.$$("Contactslist").disable();

				this.setParam("id", "");


				// const form = webix.$$("contact:form");
				// form.clear();
			}
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

		this.on(this.app, "contact:return", () => {
			this.$$("Contactslist").enable();
		});

		contacts.waitData.then(() => {
			let list = this.$$("Contactslist");
			let id = this.getParam("id", true);

			if (!id || !contacts.exists(id)) { id = contacts.getFirstId(); }
			if (id && id !== list.getSelectedId()) { list.select(id); }
		});
	}
}
