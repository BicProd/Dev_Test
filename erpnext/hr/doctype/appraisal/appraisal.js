// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt

frappe.ui.form.on('Appraisal', {
	setup: function(frm) {
		frm.add_fetch('employee', 'company', 'company');
		frm.add_fetch('employee', 'employee_name', 'employee_name');
		frm.fields_dict.employee.get_query = function(doc,cdt,cdn) {
			return{	query: "erpnext.controllers.queries.employee_query" }
		};
	},
	

  onload: function(frm) {
		if(!frm.doc.status) {
			frm.set_value('status', 'Draft');
		}
	},
	
  kra_template: function(frm) {
		frm.doc.goals = [];
		erpnext.utils.map_current_doc({
			method: "erpnext.hr.doctype.appraisal.appraisal.fetch_appraisal_template",
			source_name: frm.doc.kra_template,
			frm: frm
		});
	},
  quartal1: function(frm) {
		frm.doc.routine = [];
		erpnext.utils.map_current_doc({
			method: "erpnext.hr.doctype.appraisal.appraisal.fetch_appraisal_template_2",
			source_name: frm.doc.kra_template,
			frm: frm
		});
	},
	
  calculate_total: function(frm) {
		let goals = frm.doc.goals || [];
		let total =0;
		let routine = frm.doc.routine || [];
		let total_1 =0;
		for(let i = 0; i<goals.length; i++){
			total = flt(total)+flt(goals[i].score_earned)
		}
		for(let i = 0; i<routine.length; i++){
			total_1 = flt(total_1)+flt(routine[i].score_earned)
		}
		frm.set_value('okr_total', total);
		frm.set_value('routine_total', total_1);
		
	}
});

frappe.ui.form.on('Appraisal Goal', {
	score: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if (d.score) {
			if (flt(d.score) > 5) {
				frappe.msgprint(__("Score must be less than or equal to 5"));
				d.score = 0;
				refresh_field('score', d.name, 'goals');
			}
			d.score_earned = flt(d.per_weightage*((d.score * 0.25)+(d.superior_score *0.75)), precision("score_earned", d))/100;
		} else {
			d.score_earned = 0;
		}
		refresh_field('score_earned', d.name, 'goals');
    frm.trigger('calculate_total');
	},
	superior_score: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if (d.superior_score) {
			if (flt(d.superior_score) > 5) {
				frappe.msgprint(__("Score must be less than or equal to 5"));
				d.superior_score = 0;
				refresh_field('superior_score', d.name, 'goals');
			}
			d.score_earned = flt(d.per_weightage*((d.score * 0.25)+(d.superior_score *0.75)), precision("score_earned", d))/100;
		} else {
			d.score_earned = 0;
		}
		refresh_field('score_earned', d.name, 'goals');
    frm.trigger('calculate_total');
	}
});
frappe.ui.form.on('Appraisal Goal 2', {
	score: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if (d.score) {
			if (flt(d.score) > 5) {
				frappe.msgprint(__("Score must be less than or equal to 5"));
				d.score = 0;
				refresh_field('score', d.name, 'routine');
			}
			d.score_earned = flt(d.per_weightage*((d.score * 0.25)+(d.superior_score *0.75)), precision("score_earned", d))/100;
		} else {
			d.score_earned = 0;
		}
		refresh_field('score_earned', d.name, 'routine');
    frm.trigger('calculate_total');
	},
	superior_score: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if (d.superior_score) {
			if (flt(d.superior_score) > 5) {
				frappe.msgprint(__("Score must be less than or equal to 5"));
				d.superior_score = 0;
				refresh_field('superior_score', d.name, 'routine');
			}
			d.score_earned = flt(d.per_weightage*((d.score * 0.25)+(d.superior_score *0.75)), precision("score_earned", d))/100;
		} else {
			d.score_earned = 0;
		}
		refresh_field('score_earned', d.name, 'routine');
    frm.trigger('calculate_total');
	},
	per_weightage: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		var total = 0;
		frm.doc.routine.forEach(function(d) { total = total + d.per_weightage; });
            	frm.set_value('routine_total_weight', total);
		if (d.score) {
			if (flt(d.score) > 5) {
				frappe.msgprint(__("Score must be less than or equal to 5"));
				d.score = 0;
				refresh_field('score', d.name, 'routine');
			}
			d.score_earned = flt(d.per_weightage*((d.score * 0.25)+(d.superior_score *0.75)), precision("score_earned", d))/100;
		}
		if (d.superior_score) {
			if (flt(d.superior_score) > 5) {
				frappe.msgprint(__("Score must be less than or equal to 5"));
				d.superior_score = 0;
				refresh_field('superior_score', d.name, 'routine');
			}
			d.score_earned = flt(d.per_weightage*((d.score * 0.25)+(d.superior_score *0.75)), precision("score_earned", d))/100;
		} 
		refresh_field('score_earned', d.name, 'routine','routine_total_weight');
    frm.trigger('calculate_total');
	}
});
