# -*- coding: utf-8 -*-
# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
import datetime
from datetime import timedelta
from datetime import date
from frappe.model.document import Document
from frappe import _
from frappe.utils import time_diff_in_seconds
from erpnext.hr.doctype.employee.employee import get_employee_emails

class TrainingRequestForm(Document):
	def validate(self):
		self.set_employee_emails()
		

	def set_employee_emails(self):
		self.employee_emails = ', '.join(get_employee_emails([d.employee
			for d in self.employees]))
@frappe.whitelist()
def get_holiday_list(holiday_list):
	doc = frappe.get_doc('Holiday List',holiday_list)
	count = 0
	date_time_str = date.today()
	d = date_time_str - timedelta(days=4)
	for a in doc.holidays:
		if date_time_str > a.holiday_date:
			if d < a.holiday_date:
				count = count + 1 
	return count


