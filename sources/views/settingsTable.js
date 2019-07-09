import {JetView} from "webix-jet";

export default class SettingsTable extends JetView {
	constructor(app, name, data, localId, valHeader, valIcon, label, value) {
		super(app, name);
		this._tdata = data;
		this.localId = localId;
		this.valHeader = valHeader;
		this.valIcon = valIcon;
		this.label = label;
		this.value = value;
	}

	config() {
		const label = {
			view: "label",
			label: this.label,
			align: "center",
			localId: "label",
			css: "settings_label"
		};

		const table = {
			view: "datatable",
			localId: this.localId,
			editable: true,
			scroll: "auto",
			editaction: "dblclick",
			columns: [
				{
					id: "Value",
					header: this.valHeader,
					fillspace: true,
					editor: "text"
				},
				{
					id: "Icon",
					header: this.valIcon,
					width: 150,
					editor: "text"
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
						// text: `${_("Are you sure you want to delete the ")} ${_(this.valHeader)}`,
						ok: "OK",
						cancel: "Cancel"
					}).then(() => {
						this._tdata.remove(id);
					});
					return false;
				}
			}
		};
		const button = {
			view: "toolbar",
			padding: 0,
			elements: [
				{},
				{
					view: "button",
					label: this.label,
					type: "icon",
					icon: "wxi-plus",
					css: "webix_primary",
					width: 300,
					align: "center",
					click: () => {
						this._tdata.add({Value: this.value, Icon: "icon"});
					}
				},
				{}
			]
		};
		return {
			rows: [
				label,
				table,
				{
					cols: [
						button
					]
				}
			]
		};
	}

	init(view) {
		view.queryView("datatable").sync(this._tdata);
	}
}

