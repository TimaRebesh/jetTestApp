import {JetView} from "webix-jet";
import {icons} from "../models/iconsData";

export default class SettingsTable extends JetView {
	constructor(app, name, data, localId, headerName, valueIcon, label, value) {
		super(app, name);
		this._tdata = data;
		this.label = label;
		this.localId = localId;
		this.headerName = headerName;
		this.valueIcon = valueIcon;
		this.value = value;
	}

	config() {
		const label = {
			view: "label",
			label: this.label,
			localId: "label",
			css: "labelForSetTabl"
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
					header: this.headerName,
					fillspace: true,
					editor: "text"
				},
				{
					id: "Icon",
					header: this.valueIcon,
					width: 150,
					editor: "select",
					collection: icons
				},
				{
					id: "",
					template: "{common.trashIcon()}",
					width: 40
				}
			],
			onClick: {
				"wxi-trash": (e, id) => {
					webix.confirm({
						text: "Are you sure you want to delete this?",
						ok: "OK",
						cancel: "Cancel"
					}).then(() => {
						this._tdata.remove(id);
					});
					return false;
				}
			}
		};
		const bottom = {
			view: "toolbar",
			css: "bottomSetTabl",
			padding: 0,
			elements: [
				{},
				{
					view: "button",
					label: this.label,
					type: "icon",
					icon: "wxi-plus-square",
					css: "webix_primary",
					width: 150,
					align: "center",
					click: () => {
						this._tdata.add({Value: this.value, Icon: "icon"});
					}
				}
			]
		};
		return {
			rows: [
				label,
				table,
				{
					cols: [
						bottom
					]
				}
			]
		};
	}

	init(view) {
		view.queryView("datatable").sync(this._tdata);
	}
}

