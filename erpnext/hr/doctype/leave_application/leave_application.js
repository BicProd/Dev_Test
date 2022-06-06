// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt

cur_frm.add_fetch('employee','employee_name','employee_name');
cur_frm.add_fetch('employee','company','company');

frappe.ui.form.on("Leave Application", {
	setup: function(frm) {
		frm.set_query("leave_approver", function() {
			return {
				query: "erpnext.hr.doctype.department_approver.department_approver.get_approvers",
				filters: {
					employee: frm.doc.employee,
					doctype: frm.doc.doctype
				}
			};
		});

		frm.set_query("employee", erpnext.queries.employee);
	},
	onload: function(frm) {
		
		
		if (!frm.doc.posting_date) {
			frm.set_value("posting_date", frappe.datetime.get_today());
		}
		if (frm.doc.docstatus == 0) {
			return frappe.call({
				method: "erpnext.hr.doctype.leave_application.leave_application.get_mandatory_approval",
				args: {
					doctype: frm.doc.doctype,
				},
				callback: function(r) {
					if (!r.exc && r.message) {
						frm.toggle_reqd("leave_approver", true);
					}
				}
			});
		}
	},

	validate: function(frm) {
		frm.toggle_reqd("half_day_date", frm.doc.half_day == 1);
		if (frm.doc.half_day == 0){
			frm.doc.half_day_date = "";
		}
	},

	
	make_dashboard: function(frm) {
		var leave_details;
		let lwps;
		if (frm.doc.employee) {
			frappe.call({
				method: "erpnext.hr.doctype.leave_application.leave_application.get_leave_details",
				async: false,
				args: {
					employee: frm.doc.employee,
					date: frm.doc.from_date || frm.doc.posting_date,
					leave_type: frm.doc.leave_type
				},
				callback: function(r) {
					if (!r.exc && r.message['leave_allocation']) {
						leave_details = r.message['leave_allocation'];
					}
					if (!r.exc && r.message['leave_approver']) {
						frm.set_value('leave_approver', r.message['leave_approver']);
					}
					lwps = r.message["lwps"];
				}
			});
			$("div").remove(".form-dashboard-section.custom");
			frm.dashboard.add_section(
				frappe.render_template('leave_application_dashboard', {
					data: leave_details
				}),
				__("Allocated Leaves")
			);
			frm.dashboard.show();
			let allowed_leave_types =  Object.keys(leave_details);

			// lwps should be allowed, lwps don't have any allocation
			allowed_leave_types = allowed_leave_types.concat(lwps);

			
		}
	},

	refresh: function(frm) {
		if (frm.is_new()) {
			frm.trigger("calculate_total_days");
		}
		cur_frm.set_intro("");
		if(frm.doc.__islocal && !in_list(frappe.user_roles, "Employee")) {
			frm.set_intro(__("Fill the form and save it"));
		}

		if (!frm.doc.employee && frappe.defaults.get_user_permissions()) {
			const perm = frappe.defaults.get_user_permissions();
			if (perm && perm['Employee']) {
				frm.set_value('employee', perm['Employee'].map(perm_doc => perm_doc.doc)[0]);
			}
		}
	},

	employee: function(frm) {
		frm.trigger("make_dashboard");
		frm.trigger("get_leave_balance");
		frm.trigger("set_leave_approver");
	},

	leave_approver: function(frm) {
		if(frm.doc.leave_approver){
			frm.set_value("leave_approver_name", frappe.user.full_name(frm.doc.leave_approver));
		}
	},

	leave_type: function(frm) {
		frm.trigger("get_leave_balance");
		frm.trigger("make_dashboard");
        frm.trigger("mindatepicker");
        frm.trigger("maxdatepicker");
	frm.set_value("total_leave_days", "");
	},


	half_day: function(frm) {
		if (frm.doc.half_day) {
			if (frm.doc.from_date == frm.doc.to_date) {
				frm.set_value("half_day_date", frm.doc.from_date);
			}
			else {
				frm.trigger("half_day_datepicker");
			}
		}
		else {
			frm.set_value("half_day_date", "");
		}
		frm.trigger("calculate_total_days");
	},

	from_date: function(frm) {
		frm.trigger("make_dashboard");
		frm.trigger("half_day_datepicker");
		frm.trigger("calculate_total_days");
		frm.trigger("maxdatepicker");
frm.set_value("total_leave_days", "");

	},

	to_date: function(frm) {
		frm.trigger("half_day_datepicker");
		
		frm.trigger("calculate_total_days");
frm.set_value("total_leave_days", "");
	},

	half_day_date(frm) {
		frm.trigger("calculate_total_days");
	},

	half_day_datepicker: function(frm) {
		frm.set_value('half_day_date', '');
		var half_day_datepicker = frm.fields_dict.half_day_date.datepicker;
		half_day_datepicker.update({
			minDate: frappe.datetime.str_to_obj(frm.doc.from_date),
			maxDate: frappe.datetime.str_to_obj(frm.doc.to_date)
		})
	},
	mindatepicker: function(frm) {
		frm.set_value('from_date', '');
		var mindatepicker1 = frm.fields_dict.from_date.datepicker;
		var date = frappe.datetime.add_days(get_today(), 7);
		var app_date = frappe.datetime.add_days(get_today(), -3);
		var miss_date = frappe.datetime.add_days(get_today(), -5);
		var com_date = frappe.datetime.add_days(get_today(), -6);
		var non_c_date = frappe.datetime.add_days(get_today(), -4);
		var date2 = frappe.datetime.add_days(0);
	    if (frm.doc.leave_type == "Annual Leave") {
		    mindatepicker1.update({
		        minDate: frappe.datetime.str_to_obj(date)
		    })
		}
	    else if (frm.doc.leave_type == "Marriage Leave") {
		    mindatepicker1.update({
		        minDate: frappe.datetime.str_to_obj(date)
		    })
		}
		else if (frm.doc.leave_type == "Child Baptism Leave") {
		    mindatepicker1.update({
		        minDate: frappe.datetime.str_to_obj(date)
		    })
		}
		else if (frm.doc.leave_type == "Hajj Leave") {
		    mindatepicker1.update({
		        minDate: frappe.datetime.str_to_obj(date)
		    })
		}
		else if (frm.doc.leave_type == "Child Circumcision Leave") {
		    mindatepicker1.update({
		        minDate: frappe.datetime.str_to_obj(date)
		    })
		}
		else if (frm.doc.leave_type == "Maternity Leave") {
		    mindatepicker1.update({
		        minDate: frappe.datetime.str_to_obj(date)
		    })
		}
		else if (frm.doc.leave_type == "Paternity Leave") {
		    mindatepicker1.update({
		        minDate: frappe.datetime.str_to_obj(frappe.datetime.add_days(get_today(), -3))
		    })
		}
		else if (frm.doc.leave_type == "Spouse Miscarriage Leave") {
		    mindatepicker1.update({
		        minDate: frappe.datetime.str_to_obj(frappe.datetime.add_days(get_today(), -7)),
		        maxDate: frappe.datetime.str_to_obj(get_today())
		    })
		}
		else if (frm.doc.leave_type == "Miscarriage Leave") {
		    mindatepicker1.update({
		        minDate: frappe.datetime.str_to_obj(frappe.datetime.add_days(get_today(), -7)),
		        maxDate: frappe.datetime.str_to_obj(get_today())

		    })
		}
		else if (frm.doc.leave_type == "Compassionate Leave (Non-Immediate Family)") {
		    mindatepicker1.update({
		        minDate: frappe.datetime.str_to_obj(frappe.datetime.add_days(get_today(), -7)),
		        maxDate: frappe.datetime.str_to_obj(get_today())
		    })
		}
		else if (frm.doc.leave_type == "Compassionate Leave (Immediate Family)") {
		    mindatepicker1.update({
		        minDate: frappe.datetime.str_to_obj(frappe.datetime.add_days(get_today(), -7)),
		        maxDate: frappe.datetime.str_to_obj(get_today())
		    })
		}
		else if (frm.doc.leave_type == "Union Leave") {
		    mindatepicker1.update({
		        minDate: frappe.datetime.str_to_obj(get_today()),
                maxDate: frappe.datetime.str_to_obj(get_today())
		    })
		}
		else if (frm.doc.leave_type == "State Duty Leave") {
		    mindatepicker1.update({
		        minDate: frappe.datetime.str_to_obj(get_today()),
                maxDate: frappe.datetime.str_to_obj(get_today())
		    })
		}
		else if (frm.doc.leave_type == "Sick Leave") {
		    mindatepicker1.update({
		        minDate: frappe.datetime.str_to_obj(frappe.datetime.add_days(get_today(), -7)),
		        maxDate: frappe.datetime.str_to_obj(get_today())

		    })
		}


	},
    maxdatepicker: function(frm) {
		frm.set_value('to_date', '');
		var maxdatepicker = frm.fields_dict.to_date.datepicker;
		var datee = frappe.datetime.add_days(get_today(),-3);
		var datee1 = frappe.datetime.add_days(frm.doc.from_date , 0);
		var miss_datee = frappe.datetime.add_days(get_today(), -3);
		var maxdate2 = frappe.datetime.add_days(0);
		if (frm.doc.leave_type == "Annual Leave") {
		    maxdatepicker.update({
		        minDate: frappe.datetime.str_to_obj(frm.doc.from_date)
		    })
		}
		  else if (frm.doc.leave_type == "Marriage Leave") {
		    maxdatepicker.update({
		        minDate: frappe.datetime.str_to_obj(frm.doc.from_date)
		    })
		}
		else if (frm.doc.leave_type == "Child Marriage Leave") {
		    maxdatepicker.update({
		        minDate: frappe.datetime.str_to_obj(frm.doc.from_date)
		    })
		}
		else if (frm.doc.leave_type == "Child Baptism Leave") {
		    maxdatepicker.update({
		        minDate: frappe.datetime.str_to_obj(frm.doc.from_date)
		    })
		}
		else if (frm.doc.leave_type == "Hajj Leave") {
		    maxdatepicker.update({
		        minDate: frappe.datetime.str_to_obj(frm.doc.from_date)
		    })
		}
		else if (frm.doc.leave_type == "Child Circumcision Leave") {
		    maxdatepicker.update({
		        minDate: frappe.datetime.str_to_obj(frm.doc.from_date),

		    })
		}
		else if (frm.doc.leave_type == "Maternity Leave") {
		    maxdatepicker.update({
		        minDate: frappe.datetime.str_to_obj(frm.doc.from_date),

		    })
		}
		else if (frm.doc.leave_type == "Paternity Leave") {
		    maxdatepicker.update({
		        minDate: frappe.datetime.str_to_obj(frm.doc.from_date),
		        maxDate: frappe.datetime.str_to_obj(frappe.datetime.add_days(frm.doc.from_date , 1))
		    })
		}
		else if (frm.doc.leave_type == "Spouse Miscarriage Leave") {
		    maxdatepicker.update({
		        minDate: frappe.datetime.str_to_obj(frm.doc.from_date),
		        maxDate: frappe.datetime.str_to_obj(frappe.datetime.add_days(frm.doc.from_date , 1))
		    })
		}
		else if (frm.doc.leave_type == "Miscarriage Leave") {
		    maxdatepicker.update({
		        minDate: frappe.datetime.str_to_obj(frm.doc.from_date),
		        maxDate: frappe.datetime.str_to_obj(frappe.datetime.add_days(frm.doc.from_date , 44))
		    })
		}
		else if (frm.doc.leave_type == "Compassionate Leave (Non-Immediate Family)") {
		    maxdatepicker.update({
		        minDate: frappe.datetime.str_to_obj(frm.doc.from_date),
		        maxDate: frappe.datetime.str_to_obj(frappe.datetime.add_days(frm.doc.from_date , 0))
		    })
		}
	    else if (frm.doc.leave_type == "Compassionate Leave (Immediate Family)") {
		    maxdatepicker.update({
		        minDate: frappe.datetime.str_to_obj(frm.doc.from_date),
		        maxDate: frappe.datetime.str_to_obj(frappe.datetime.add_days(frm.doc.from_date , 2))
		    })
		}
		else if (frm.doc.leave_type == "Union Leave") {
		    maxdatepicker.update({
		        minDate: frappe.datetime.str_to_obj(get_today()),
		        maxDate: frappe.datetime.str_to_obj(get_today())

		    })
		}
		else if (frm.doc.leave_type == "State Duty Leave") {
		    maxdatepicker.update({
		        minDate: frappe.datetime.str_to_obj(get_today()),
		        maxDate: frappe.datetime.str_to_obj(get_today())

		    })
		}
		else if (frm.doc.leave_type == "Sick Leave") {
		    maxdatepicker.update({
		        minDate: frappe.datetime.str_to_obj(frm.doc.from_date)


		    })
		}


	},
	get_leave_balance: function(frm) {
		if(frm.doc.docstatus==0 && frm.doc.employee && frm.doc.leave_type && frm.doc.from_date && frm.doc.to_date) {
			return frappe.call({
				method: "erpnext.hr.doctype.leave_application.leave_application.get_leave_balance_on",
				args: {
					employee: frm.doc.employee,
					date: frm.doc.from_date,
					to_date: frm.doc.to_date,
					leave_type: frm.doc.leave_type,
					consider_all_leaves_in_the_allocation_period: true
				},
				callback: function(r) {
					if (!r.exc && r.message) {
						frm.set_value('leave_balance', r.message);
					}
					else {
						frm.set_value('leave_balance', "0");
					}
				}
			});
		}
	},

	calculate_total_days: function(frm) {
		if(frm.doc.from_date && frm.doc.to_date && frm.doc.employee && frm.doc.leave_type) {

			var from_date = Date.parse(frm.doc.from_date);
			var to_date = Date.parse(frm.doc.to_date);

			if(to_date < from_date){
				frappe.msgprint(__("To Date cannot be less than From Date"));
				frm.set_value('to_date', '');
				return;
			}
				// server call is done to include holidays in leave days calculations
			return frappe.call({
				method: 'erpnext.hr.doctype.leave_application.leave_application.get_number_of_leave_days',
				args: {
					"employee": frm.doc.employee,
					"leave_type": frm.doc.leave_type,
					"from_date": frm.doc.from_date,
					"to_date": frm.doc.to_date,
					"half_day": frm.doc.half_day,
					"half_day_date": frm.doc.half_day_date,
				},
				callback: function(r) {
					if (r && r.message) {
						frm.set_value('total_leave_days', r.message);
						frm.trigger("get_leave_balance");
					}
				}
			});
		}
	},

	set_leave_approver: function(frm) {
		if(frm.doc.employee) {
				// server call is done to include holidays in leave days calculations
			return frappe.call({
				method: 'erpnext.hr.doctype.leave_application.leave_application.get_leave_approver',
				args: {
					"employee": frm.doc.employee,
				},
				callback: function(r) {
					if (r && r.message) {
						frm.set_value('leave_approver', r.message);
					}
				}
			});
		}
	}




});



