// Copyright (c) 2021, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on('IT Support Request', {
	status: function(frm) {
		if (frm.doc.status == "Done") {
			frm.set_value("finish_time", frappe.datetime.nowdate());
		}
	}
});
