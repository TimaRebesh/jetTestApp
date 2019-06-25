import {JetView} from "webix-jet";
import {contacts} from "../../models/contacts";
import {statuses} from "../../models/statuses";


export default class ContactsProfile extends JetView {
	config() {
		const topbar = {
			view: "toolbar",
			borderless: true,
			elements: [
				{template: "#FirstName# #LastName#", localId: "test", width: 200, height: 50, borderless: true, css: "toolbarname"},
				{},
				{view: "button", label: "Delete", type: "icon", icon: "wxi-trash", width: 100},
				{view: "button", label: "Edit", type: "icon", icon: "mdi mdi-file-document-edit", width: 100}
			]};

		const userInfo = {
			cols: [
				{
					view: "template",
					borderless: true,
					localId: "template",
					template: obj => `
							<div class="usercont">
								<div class="userinfo_1">
									<image class="bigphoto" src="${obj.Photo}" />
									<p class="status">${obj.statusString}</p>
								</div>
								<div class="userinfo_2">
									<p><span class="useremail mdi mdi-email"></span> email: ${obj.Email}</p>
									<p><span class="userskype mdi mdi-skype"></span> skype: ${obj.Skype}</p>
									<p><span class="mdi mdi-tag"></span> job: ${obj.Job}</p>
									<p><span class="usercompany mdi mdi-briefcase"></span> company ${obj.Company}</p>
								</div>
								<div class="userinfo_3">
									<p><span class="userbirthday webix_icon wxi-calendar"></span> day of birth: ${obj.Company}</p>
									<p><span class="userlocation mdi mdi-map-marker"></span> location: ${obj.Address}</p>
								</div>
							</div>
					`
				}
			]
		};

		const ui = {
			rows: [
				topbar,
				userInfo
			]
		};
		return ui;
	}

	init() {

	}


	urlChange() {
		const self = this;
		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		]).then(() => {
			const id = self.getParam("id");
			const values = contacts.getItem(id);
			values.statusString = statuses.getItem(values.StatusID).Value;
			let template = self.$$("template");
			if (values) { template.setValues(values); }
			self.$$("test").parse(values);
		});
	}
}
