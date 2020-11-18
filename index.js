window.onload = function() {
    document.getElementById('csv-file').addEventListener(
        'change', preview_csv, false
    );
}

function preview_csv(e) {
    if (!e.target.files.length) {
        alert("Please choose a csv file...");
        return
    }

    const file = e.target.files[0];

    // parse file then pass to html generator
    Papa.parse(file, {
        complete: function(result) {
            if (result.data && result.data.length > 0) {
                htmlTableGenerator(result.data)
            }
        }
    });
}

function htmlTableGenerator(content) {
    let csv_preview = document.getElementById('csv-preview');

    let html = '<table id="example" class="table table-condensed table-hover table-striped" style="width:100%">';

    if (content.length == 0 || typeof(content[0]) === 'undefined') {
        return null
    } else {
        const header = content[0];
        const data = content.slice(1);

        html += '<thead>';
        html += '<tr>';
        header.forEach(function(colData) {
            html += '<th>' + colData + '</th>';
        });
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';

        data.forEach(function(row) {
            if (header.length === row.length) {
                html += '<tr>';
                row.forEach(function(colData) {
                    html += '<td>' + colData + '</td>';
                });
                html += '</tr>';
            }
        });

        html += '</tbody>';
        html += '</table>';

        // insert table element into csv preview
        csv_preview.innerHTML = html;

        // initialise DataTable
        initDataTable();
    }
}

function initDataTable() {
    $('#example').dataTable({
        scrollX: true,
        scrollY: (window.innerHeight / 2) + "px",
        dom: 'Bfrtip',
        buttons: [
            'colvis',
            {
                extend: 'csv',
                text: 'Download CSV',
                exportOptions: {
                    columns: ':visible'
                }
            }
        ]
    })
}