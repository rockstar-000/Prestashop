"use strict";

$("#admin_dashboard_client_list").dataTable({
  "columnDefs": [
    { "sortable": false, "targets": [2,3] }
  ]
});

$("#admin_dashboard_payments").dataTable({
  "columnDefs": [
    { "sortable": false, "targets": [2,3] }
  ]
});

$("#journal_summary_journal").dataTable({
  "columnDefs": [
    { "sortable": false, "targets": [0,2,3] }
  ]
});

$("#session_list").dataTable({
  "columnDefs": [
    { "sortable": false, "targets": [0,2,3] }
  ]
});

$("#plan_users_list").dataTable({
  "columnDefs": [
    { "sortable": false, "targets": [0,2,3] }
  ]
});

$("#plan_invoice_list").dataTable({
  "columnDefs": [
    { "sortable": false, "targets": [0,2,3] }
  ]
});