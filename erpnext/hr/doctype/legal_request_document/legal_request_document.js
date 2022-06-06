// Copyright (c) 2021, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

//frappe.ui.form.on('Legal Request Document', {
	// refresh: function(frm) {

	// }
//});


frappe.ui.form.on("Legal Request Document", "validate", function(frm) {
	var date_req = frm.doc.date_required;
	var today = frappe.datetime.add_days(get_today(), 0);
//	var today = get_today();
  

if (date_req <= today && frm.doc.status == "Open") {
		msgprint(__("Minimal Request date H+1"));
		validated=false;
		return false;
	}
if (frm.doc.disclaimer_check == 0) {
		msgprint(__("Please Check the disclaimer"));
		validated=false;
		return false;
	}

})






/*


*/
