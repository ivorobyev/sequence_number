function make_table(res_list, t_name){
    res_list = res_list.trim()
    seq_numbers = res_list.split(' ')
            
    var perrow = 3,

    tbl = "<div class = 'res_table'><h3>"+t_name+"</h3><table id = '"+t_name+"'><tr><th>Number of nucleotide mutaions</th><th>Possible amino acid sequences</th><th>Integral number of amino acid sequences</th></tr><tr>";

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

    return tbl

}

function calculate() {
    var file = $('#seq_file');

    if (file.prop('files').length) {
      var formData = new FormData($('form')[0]);
      formData.append('seq', file.prop('files')[0]);
    }

    event.preventDefault();

    $.ajax({
        url: "/calc",
        data: formData,
        type: 'POST',
        cache: false,             
        processData: false, 
        contentType: false,
        success: function(response) {
            var html = ''
            $.each(JSON.parse(response), function(val, key) {
                html += make_table(key, val)
              });

            $('#result').show()
            $('#len').html(html)
        },
        error: function(response) {
            $('#result').show()
            $('#len').html("<p class = 'error'>ERROR!</p>") 
        }
    });
}