// Copyright (c) 2016, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on('Training Feedback', {
	onload: function(frm) {
		frm.add_fetch("training_event", "course", "course");
		frm.add_fetch("training_event", "event_name", "event_name");
		frm.add_fetch("training_event", "trainer_name", "trainer_name");
	},
	employee: function(frm) {
	    frappe.call({
		method : "erpnext.hr.doctype.training_feedback.training_feedback.event_employee",
		args: {
			employee : frm.doc.employee
		},
		callback: function (data) {
			cur_frm.fields_dict['training_event'].get_query = function(doc) {
	       		return {
		    		filters: [
			            ['Training Request Form', 'name', 'in', data.message],
					['Training Request Form', 'docstatus', '=', 1],
		            ]
	       		}       
        		}
			
		}
	});
	
	}
});
