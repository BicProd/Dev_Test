# -*- coding: utf-8 -*-
# Copyright (c) 2021, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe.utils.nestedset import NestedSet
# from erpnext.utilities.transaction_base import delete_events


class LegalDocumentControl(NestedSet):
	nsm_parent_field = 'parent_legal_document_control'

	
	
