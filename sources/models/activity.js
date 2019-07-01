const frontFormat = webix.Date.strToDate("%d-%m-%Y %H:%i");
const serverFormat = webix.Date.dateToStr("%Y-%m-%d");
const formatTime = webix.Date.dateToStr("%H:%i");

export const activity = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$init: (obj) => {
			if (!obj.NewDate) {
				obj.NewDate = frontFormat(obj.DueDate);
			}
			if (!obj.NewTime) {
				obj.NewTime = obj.NewDate;
			}
		},
		$save: (obj) => {
			obj.DueDate = `${serverFormat(obj.NewDate)} ${formatTime(obj.NewTime)}`;
		}
	}
});
