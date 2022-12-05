// Copyright (c) 2016, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on('Training Request Form', {
	
	onload_post_render: function(frm) {
		frm.get_field("employees").grid.set_multiple_add("employee");
	},
	refresh: function(frm) {
		if(!frm.doc.__islocal) {
	
			frm.add_custom_button(__("Training Feedback"), function() {
				frappe.route_options = {
					training_request_form: frm.doc.name
				}
				frappe.set_route("List", "Training Feedback");
			});
		}
		var mindatepicker = frm.fields_dict.start_time.datepicker;
		mindatepicker.update({
		        minDate: frappe.datetime.str_to_obj(frappe.datetime.add_days(frm.doc.created_on,1))
		    })

		
		}
});
