import {JetView} from "webix-jet";
import {contacts} from "../models/contacts";


export default class ContactsView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		const contactsFilter = {
			view: "text",
			localId: "inputFilter",
			height: 50,
			placeholder: _("type to find matching contact"),
			on: {
				onTimedKeyPress: () => {
					let value = this.$$("inputFilter").getValue().toLowerCase();
					this.$$("Contactslist").filter((obj) => {
						let fullName = [obj.FirstName, obj.LastName].join(" ");
						let name = fullName.toLowerCase().indexOf(value);
						let job = obj.Job.toLowerCase().indexOf(value);
						return name !== -1 || job !== -1;
					});
				}
			}
		};

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
			label: _("Add contact"),
			localId: "buttonAddList",
			type: "icon",
			icon: "wxi-plus",
			value: "Add",
			anchoralign: "center",
			scrol: "auto",
			click: () => {
				this.show("contactsElements.contactsForm");
				this.$$("Contactslist").disable();
				this.app.callEvent("contactform:show", [_("Add")]);
			}
		};

		return {
			cols: [
				{
					rows: [
						contactsFilter,
						list,
						buttonList
					]
				},
				{$subview: true}
			]
		};
	}

	init() {
		const _ = this.app.getService("locale")._;

		contacts.waitData.then(() => {
			const Contactslist = this.$$("Contactslist");
			Contactslist.sync(contacts);

			this.show("contactsElements.contactsProfile");

			// eslint-disable-next-line no-shadow
			this.on(this.app, "contact:switch", (id, mode, check) => {
				this.$$("Contactslist").enable();
				if (mode === _("Add") && check) {
					id = this.contactList.getFirstId();
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

	urlChange() {
		const Contactslist = this.$$("Contactslist");
		contacts.waitData.then(() => {
			let id = this.getParam("id", true);
			if (!id || !contacts.exists(id)) { id = contacts.getFirstId(); }
			if (id && id !== Contactslist.getSelectedId()) { Contactslist.select(id); }
		});
	}
}

