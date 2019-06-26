const serverFormat = webix.Date.dateToStr("%Y-%m-%d %H:%i");
const frontFormat = webix.Date.strToDate("%d-%m-%Y %H:%i");

export const activity = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$init: (obj) => {
			if (!obj.NewDate) {
				obj.NewDate = new Date(frontFormat(obj.DueDate));
			}
			if (!obj.NewTime) {
				obj.NewTime = new Date(obj.NewDate);
			}
		},
		$save: (obj) => {
			obj.DueDate = new Date(obj.NewDate);
			obj.DueTime = new Date(obj.NewTime);
			obj.DueDate.setHours(obj.DueTime.getHours());
			obj.DueDate.setMinutes(obj.DueTime.getMinutes());
			obj.DueDate = serverFormat(obj.DueDate);
		}
	}
});
