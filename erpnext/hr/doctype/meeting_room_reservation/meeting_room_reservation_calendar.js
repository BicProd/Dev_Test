// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt

frappe.views.calendar["Meeting Room Reservation"] = {
	field_map: {
		"start": "start",
		"end": "end",
		"id": "name",
		"color": "color",
		"title": "meeting_room",
		"allDay": "allDay"
	},
	gantt: true,
	filters: [
		{
			"workflow_state": "Approved"
		}
	],
	get_events_method: "frappe.desk.calendar.get_events"
}
