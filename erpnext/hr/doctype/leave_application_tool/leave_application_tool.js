// Copyright (c) 2020, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on('Leave Application Tool', {
	refresh: function(frm) {
		frm.disable_save();
	},
	onload: function(frm) {
		erpnext.leave_application_tool.load_employees(frm);
	},

	from_date: function(frm) {
		erpnext.leave_application_tool.load_employees(frm);
	},

	department: function(frm) {
		erpnext.leave_application_tool.load_employees(frm);
	},

	branch: function(frm) {
		erpnext.leave_application_tool.load_employees(frm);
	},

	company: function(frm) {
		erpnext.leave_application_tool.load_employees(frm);
	}

});
erpnext.leave_application_tool = {
	load_employees: function(frm) {
		if(frm.doc.from_date) {
			frappe.call({
				method: "erpnext.hr.doctype.leave_application_tool.leave_application_tool.get_employees",
				args: {
					date: frm.doc.from_date,
					department: frm.doc.department,
					branch: frm.doc.branch,
					company: frm.doc.company
				},
				callback: function(r) {
					if(r.message['unmarked'].length > 0) {
						unhide_field('leave_application_section')
						if(!frm.employee_area) {
							frm.employee_area = $('<div>')
							.appendTo(frm.fields_dict.employees_html.wrapper);
						}
						frm.EmployeeSelector = new erpnext.EmployeeSelector(frm, frm.employee_area, r.message['unmarked'])
					}
					else{
						hide_field('leave_application_section')
					}

					if(r.message['marked'].length > 0) {
						unhide_field('marked_leave')
						if(!frm.marked_employee_area) {
							frm.marked_employee_area = $('<div>')
								.appendTo(frm.fields_dict.marked_leave_html.wrapper);
						}
						frm.marked_employee = new erpnext.MarkedEmployee(frm, frm.marked_employee_area, r.message['marked'])
					}
					else{
						hide_field('marked_leave')
					}
				}
			});
		}
	}
}
erpnext.MarkedEmployee = Class.extend({
	init: function(frm, wrapper, employee) {
		this.wrapper = wrapper;
		this.frm = frm;
		this.make(frm, employee);
	},
	make: function(frm, employee) {
		var me = this;
		$(this.wrapper).empty();

		var row;
		$.each(employee, function(i, m) {
			var attendance_icon = "fa fa-check";
			var color_class = "";
			if(m.status == "Absent") {
				attendance_icon = "fa fa-check-empty"
				color_class = "text-muted";
			}
			else if(m.status == "Half Day") {
				attendance_icon = "fa fa-check-minus"
			}

			if (i===0 || i % 4===0) {
				row = $('<div class="row"></div>').appendTo(me.wrapper);
			}

			$(repl('<div class="col-sm-3 %(color_class)s">\
				<label class="marked-employee-label"><span class="%(icon)s"></span>\
				%(employee)s</label>\
				</div>', {
					employee: m.employee_name,
					icon: attendance_icon,
					color_class: color_class
				})).appendTo(row);
		});
	}
});

erpnext.EmployeeSelector = Class.extend({
	init: function(frm, wrapper, employee) {
		this.wrapper = wrapper;
		this.frm = frm;
		this.make(frm, employee);
	},
	make: function(frm, employee) {
		var me = this;

		$(this.wrapper).empty();
		var employee_toolbar = $('<div class="col-sm-12 top-toolbar">\
			<button class="btn btn-default btn-add btn-xs"></button>\
			<button class="btn btn-xs btn-default btn-remove"></button>\
			</div>').appendTo($(this.wrapper));

		var mark_employee_toolbar = $('<div class="col-sm-12 bottom-toolbar">\
			<button class="btn btn-primary btn-mark-present btn-xs"></button>\
			<button class="btn btn-default btn-mark-absent btn-xs"></button>\
			</div>')

		employee_toolbar.find(".btn-add")
			.html(__('Check all'))
			.on("click", function() {
				$(me.wrapper).find('input[type="checkbox"]').each(function(i, check) {
					if(!$(check).is(":checked")) {
						check.checked = true;
					}
				});
			});

		employee_toolbar.find(".btn-remove")
			.html(__('Uncheck all'))
			.on("click", function() {
				$(me.wrapper).find('input[type="checkbox"]').each(function(i, check) {
					if($(check).is(":checked")) {
						check.checked = false;
					}
				});
			});

		mark_employee_toolbar.find(".btn-mark-present")
			.html(__('Mark Leave'))
			.on("click", function() {
				var employee_present = [];
				$(me.wrapper).find('input[type="checkbox"]').each(function(i, check) {
					if($(check).is(":checked")) {
						employee_present.push(employee[i]);
					}
				});
				frappe.call({
					method: "erpnext.hr.doctype.leave_application_tool.leave_application_tool.mark_employee_attendance",
					args:{
						"employee_list":employee_present,
						"leave_type":"Annual Leave",
						"date":frm.doc.from_date,
						"company":frm.doc.company
					},

					callback: function(r) {
						erpnext.leave_application_tool.load_employees(frm);

					}
				});
			});


		var row;
		$.each(employee, function(i, m) {
			if (i===0 || (i % 4) === 0) {
				row = $('<div class="row"></div>').appendTo(me.wrapper);
			}

			$(repl('<div class="col-sm-3 unmarked-employee-checkbox">\
				<div class="checkbox">\
				<label><input type="checkbox" class="employee-check" employee="%(employee)s"/>\
				%(employee)s</label>\
				</div></div>', {employee: m.employee_name})).appendTo(row);
		});

		mark_employee_toolbar.appendTo($(this.wrapper));
	}
});
