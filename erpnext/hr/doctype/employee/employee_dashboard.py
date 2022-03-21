
from __future__ import unicode_literals
from frappe import _

def get_data():
	return {
		'heatmap': True,
		'heatmap_message': _('This is based on the attendance of this Employee'),
		'fieldname': 'employee',
		'transactions': [
			{
				'label': _('Leave and Attendance'),
				'items': ['Attendance', 'Attendance Request', 'Leave Application', 'Leave Allocation', 'Employee Checkin']
			},
			{
				'label': _('Lifecycle'),
				'items': ['Employee Transfer', 'Employee Promotion', 'Employee Separation']
			},
			{
				'label': _('Shift'),
				'items': ['Shift Request', 'Shift Assignment']
			},
			{
				'label': _('Performance'),
				'items': ['Appraisal']

			},
			{
				'label': _('Expense'),
				'items': ['Expense Claim', 'Travel Request', 'Employee Advance']
			},
			{
				'label': _('Benefit'),
				'items': ['Employee Benefit Application', 'Employee Benefit Claim']
			},
			{
				'label': _('Payroll'),
				'items': ['Salary Structure Assignment', 'Salary Slip', 'Additional Salary', 'Timesheet','Employee Incentive', 'Retention Bonus']
			},
			{
				'label': _('Training'),
				'items': ['Training Request Form', 'Survey', 'Employee Skill Map']
			},
		]
	}
