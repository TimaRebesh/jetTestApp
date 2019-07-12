import {JetView} from "webix-jet";
import {files} from "../../models/files";
import {contacts} from "../../models/contacts";

export default class FilesDataTable extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		return {
			id: "contact:files",
			rows: [
				{
					view: "datatable",
					localId: "datatableFiles",
					select: true,
					columns: [
						{
							id: "name",
							header: _("Name"),
							fillspace: true,
							sort: "string"
						},
						{
							id: "changeDate",
							header: _("Change date"),
							fillspace: true,
							sort: "date",
							format: webix.i18n.longDateFormatStr
						},
						{
							id: "size",
							header: _("Size"),
							fillspace: true,
							template: obj => `${obj.size}Kb`,
							sort: "int"
						},
						{
							header: "",
							id: "delete",
							template: "{common.trashIcon()}",
							width: 40
						}

					],
					onClick: {
						"wxi-trash": (e, id) => {
							webix.confirm({
								text: _("The file will be deleted.<br/> Are you sure?"),
								ok: _("OK"),
								cancel: _("Cancel")
							}).then(() => {
								if (id) { files.remove(id); }
							});
							return false;
						}
					}
				},
				{cols: [
					{},
					{
						view: "uploader",
						id: "uploader",
						type: "iconButton",
						icon: "mdi mdi-upload",
						label: _("Upload file"),
						width: 240,
						on: {
							onBeforeFileAdd: (file) => {
								const id = this.getParam("id", true);
								if (id && contacts.exists(id)) {
									const values = {
										name: file.name,
										size: Math.round(file.size / 1000),
										changeDate: file.file.lastModifiedDate,
										contactID: id
									};
									files.add(values);
								}
								return false;
							},
							onFileUploadError: () => {
								webix.alert("Upload failed");
							}
						}
					},
					{}
				]
				}
			]
		};
	}

	init() {
		this.$$("datatableFiles").sync(files);
	}

	urlChange() {
		const id = this.getParam("id", true);
		files.filter(file => file.contactID.toString() === id.toString());
	}
}
