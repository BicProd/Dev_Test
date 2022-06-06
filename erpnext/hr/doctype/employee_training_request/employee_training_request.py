# -*- coding: utf-8 -*-
# Copyright (c) 2021, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class EmployeeTrainingRequest(Document):
	def submit(self):
		doc = frappe.get_doc('Training Request Form', self.training_request)
		doc.append('employees', {
    			'employee': self.employee,
    			'employee_name': self.employee_name,
			'department': self.department,
			'status': 'Open',
			'Attendance': 'Mandatory'
		})
		doc.save()

