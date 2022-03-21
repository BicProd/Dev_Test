# -*- coding: utf-8 -*-
# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class Survey(Document):
	def validate(self):
		training_event = frappe.get_doc("Training Request Form", self.event)
		print(training_event);
		print(self.employee);
		for e in training_event.employees:
			if e.employee == self.employee:
				e.status = 'Feedback Submitted'
				print(e.employee);
				print(e.status);
				break

		training_event.save()
	def submit(self):
		doc = frappe.get_doc('Vendor', self.vendor1)
		doc.append('survey_data', {
    			'vendor': self.vendor1,
    			'rating': self.rating,
			'speaker': self.trainer_name,
			'attendee': self.employee_name
		})
		count = 0
		total = 0
		for a in doc.survey_data:
			count = count + 1 
			total = total + a.rating
		doc.average_rating = total / count
		doc.save()


