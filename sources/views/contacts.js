import {JetView} from "webix-jet";
import {contacts} from "../models/contacts";


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
					this.setParam("id", id, true);
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
				this.show("contactsElements.contactsForm");
				this.$$("Contactslist").disable();
				this.app.callEvent("contactform:show", ["Add"]);
			}
		};

		return {
			cols: [
				{
					rows: [
						list,
						buttonList
					]
				},
				{$subview: true}
			]
		};
	}

	init() {
		contacts.waitData.then(() => {
			const Contactslist = this.$$("Contactslist");
			Contactslist.sync(contacts);

			let id = this.getParam("id", true);
			if (!id || !contacts.exists(id)) { id = contacts.getFirstId(); }
			if (id && id !== Contactslist.getSelectedId()) { Contactslist.select(id); }

			this.show("contactsElements.contactsProfile");

			// eslint-disable-next-line no-shadow
			this.on(this.app, "contact:switch", (id, mode, check) => {
				this.$$("Contactslist").enable();
				if (mode === "Add" && check) {
					this.contactList.select(this.contactList.getFirstId());
				}
				else if (mode) {
					this.contactList.select(id);
				}
				this.show(`/top/contacts?id=${id}/contactsElements.contactsProfile`);
			});

			this.on(this.app, "contactform:show", (mode) => {
				this.show("contactsElements.contactsForm").then(() => {
					this.setParam("mode", mode);
				});
			});
		});
	}
}

