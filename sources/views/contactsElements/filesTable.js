import {JetView} from "webix-jet";
import {files} from "../../models/files";
import {contacts} from "../../models/contacts";

export default class FilesDataTable extends JetView {
	config() {
		return {
			id: "contact:files",
			rows: [
				{
					view: "datatable",
					localId: "datatable",
					select: true,
					columns: [
						{
							id: "name",
							header: "Name",
							fillspace: true,
							sort: "string"
						},
						{
							id: "ChangeDate",
							header: "Change date",
							fillspace: true,
							sort: "date",
							format: webix.i18n.longDateFormatStr
						},
						{
							id: "size",
							header: "Size",
							fillspace: true,
							template: obj => `${obj.size}Kb`,
							sort: "int"
						},
						{
							id: "",
							template: "{common.trashIcon()}",
							width: 60
						}

					],
					onClick: {
						"wxi-trash": (e, id) => {
							webix.confirm({
								text: "The file will be deleted. Deleting cannot be undone... <br/> Are you sure?"
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
						label: "Upload file",
						width: 200,
						on: {
							onBeforeFileAdd: (file) => {
								const id = this.getParam("id", true);
								if (id && contacts.exists(id)) {
									const values = {
										name: file.name,
										size: Math.round(file.size / 1000),
										ChangeDate: file.file.lastModifiedDate,
										ContactID: id
									};
									files.add(values);
								}
								return false;
							},
							onFileUploadError: () => {
								webix.alert("Upload failed.");
							}
						}
					},
					{}
				]
				}
			]
		};
	}

	init(view) {
		view.queryView("datatable").sync(files);
	}

	urlChange() {
		const id = this.getParam("id", true);
		files.data.filter(file => file.ContactID.toString() === id);
	}
}
