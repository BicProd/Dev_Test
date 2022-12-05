# -*- coding: utf-8 -*-
# Copyright (c) 2022, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class PrintLabel(Document):
	pass


@frappe.whitelist()
def update_serial_no(serial_no, secondary_uom_kg):
	frappe.db.set_value('Serial No', serial_no, 'secondary_uom_kg', secondary_uom_kg)

@frappe.whitelist()
def validate(self):
    print_label = frappe.get_doc(dict(
        doctype = 'Print Label',
        label_serial_no = [
            dict(
                secondary_uom_kg = 99
            )
        ]
    ))
    print_label.insert()
    print_label.submit()
    # doc = frappe.get_doc({"doctype":"Serial No",
    #     "secondary_uom_kg":self.secondary_uom_kg
    # })
    # doc.save()
    # self.kg_qty()

#def kg_qty(self):
#     doc = frappe.get_doc({"doctype":"Serial No",
#         "secondary_uom_kg":self.secondary_uom_kg
#     })
#     doc.save()
