function make_table(res_list){
    res_list = res_list.trim()
    seq_numbers = res_list.split(' ')
            
    var perrow = 3,
    tbl = "<table id = 'sequence_number'><tr><th>Number of nucleotide mutaions</th><th>Possible amino acid sequences</th><th>Integral number of amino acid sequences</th></tr><tr>";

    for (var i=0; i<seq_numbers.length; i++) {
        tbl += "<td>" + seq_numbers[i] + "</td>";
        var next = i+1;
        if (next%perrow==0 && next!=seq_numbers.length) {
            tbl += "</tr><tr>";
        }
    }
    tbl += "</tr></table>";
    tbl += '<br/><a download="sequnce_number.csv" href="#" onclick="return ExcellentExport.csv(this, \'sequence_number\');">Export to CSV</a>'

    $('#result').show()
    $('#len').html(tbl) 

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
            make_table(response)
        },
        error: function(response) {
            $('#result').show()
            $('#len').html("<p class = 'error'>ERROR!</p>") 
        }
    });
}