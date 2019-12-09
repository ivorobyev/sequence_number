function make_table(results, t_name){
    res_list = results.toString().split(',')[0]
    err_msg = results.toString().split(',')[1]
    res_list = res_list.trim()
    seq_numbers = res_list.split(' ')
            
    var perrow = 3,
    tbl =  ''
    if (err_msg.indexOf('ERROR') == -1){
        tbl = "<div class = 'res_table'><h3>"+t_name+"</h3><table id = '"+t_name+"'><tr><th>Number of nucleotide mutaions</th><th>Possible amino acid sequences</th><th>Integral number of amino acid sequences</th></tr><tr>";
        if (err_msg.indexOf('WARNING') != -1){
            tbl += "<p class = 'warning'>"+err_msg+"</p>"
        }
        for (var i=0; i<seq_numbers.length; i++) {
            tbl += "<td>" + seq_numbers[i] + "</td>";
            var next = i+1;
            if (next%perrow==0 && next!=seq_numbers.length) {
                tbl += "</tr><tr>";
            }
        }
        tbl += "</tr></table>";
        tbl += "<br/><a download=\"sequnce_number.csv\" href=\"#\" onclick=\"return ExcellentExport.csv(this, \'"+t_name+"\');\">Export to CSV</a>"
        tbl += "</div>"
    }
    else {
        tbl = "<div class = 'res_table'><h3>"+t_name+"</h3><p class = 'error'>"+err_msg+"</p></div>"
    }
    return tbl
}

function calculate() {
    var file = $('#seq_file');

    if (file.prop('files').length) {
        var formData = new FormData($('form')[0]);
        formData.append('seq', file.prop('files')[0]);
    }
    else {
        alert('Empty file')
        return
    }

    event.preventDefault();

    $.ajax({
        url: "/calc",
        data: formData,
        type: 'POST',
        cache: false,             
        processData: false, 
        contentType: false,
        beforeSend: function() {
            $("#loader").show();
        },
        success: function(response) {
            $("#loader").hide();
            var html = ''
            $.each(JSON.parse(response), function(val, key) {
                html += make_table(key, val)
              });

            $('#result').show()
            $('#len').html(html)
        },
        error: function(response) {
            $("#loader").hide();
            $('#result').show()
            $('#len').html("<p class = 'error'>ERROR!</p>") 
        }
    });
}