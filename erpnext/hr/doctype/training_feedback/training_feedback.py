# -*- coding: utf-8 -*-
# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe import _

class TrainingFeedback(Document):

	def on_submit(self):
		speaker = frappe.get_doc("Speaker Training", self.trainer_name)
		speaker.append("speaker_rating",{
			"training_feedback":self.name,	
			"employee":self.employee,
			"employee_name":self.employee_name,
			"rating":self.rating
		
		})
		speaker.save()
		

@frappe.whitelist()
def employee_event(training):
	employee_list = frappe.db.get_list('Training Attendee',filters={'parent':training},pluck='employee')
	return employee_list
		
@frappe.whitelist()
def event_employee(employee):
	event_list = frappe.db.get_list('Training Attendee',filters={'employee':employee},pluck='parent')
	return event_list
