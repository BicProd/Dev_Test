# -*- coding: utf-8 -*-
# Copyright (c) 2020, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
import json
from frappe.model.document import Document
from frappe.utils import getdate

class LeaveApplicationTool(Document):
	pass

@frappe.whitelist()
def get_employees(date, department = None, branch = None, company = None):
	leave_not_marked = []
	leave_marked = []
	filters = {"status": "Active", "date_of_joining": ["<=", date]}

	for field, value in {'department': department,
		'branch': branch, 'company': company}.items():
		if value:
			filters[field] = value

	employee_list = frappe.get_list("Employee", fields=["employee", "employee_name"], filters=filters, order_by="employee_name")
	marked_employee = {}
	for emp in frappe.get_list("Attendance", fields=["employee", "status"],
							   filters={"attendance_date": date}):
		marked_employee[emp['employee']] = emp['status']

	for employee in employee_list:
		employee['status'] = marked_employee.get(employee['employee'])
		if employee['employee'] not in marked_employee:
			leave_not_marked.append(employee)
		else:
			leave_marked.append(employee)
	return {
		"marked": leave_marked,
		"unmarked": leave_not_marked
	}
@frappe.whitelist()
def mark_employee_attendance(employee_list, leave_type, date,  company=None):

	employee_list = json.loads(employee_list)
	for employee in employee_list:



		if not company:
			company = frappe.db.get_value("Employee", employee['employee'], "Company")

		leave=frappe.get_doc(dict(
			doctype='Leave Application',
			employee=employee.get('employee'),
			employee_name=employee.get('employee_name'),
			from_date=getdate(date),
			to_date=getdate(date),
			status="Approved",
			total_leave_days="1",
			leave_type=leave_type,
			company=company
		))
		leave.insert()
		leave.submit()
