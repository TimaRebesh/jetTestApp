import {JetView} from "webix-jet";

export default class CommonTableForSettings extends JetView {
	constructor(app, name, data, localId, valHeader, valIcon, label, value ) {
		super(app, name);
		this._tdata = data;
		this.localId = localId;
		this.valHeader = valHeader;
		this.valIcon = valIcon;
		this.label = label;
		this.value = value;
	}

	config() {
	}
}
