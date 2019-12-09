from flask import Flask, request, render_template, json
import sequence_number as sn
import os
from Bio import SeqIO

app = Flask(__name__)

def check_sequence(sequence, codon_table):
    symbols = 'ATGCU'
    for a in sequence:
        if a.upper() not in symbols:
            return 'ERROR: wrong sequence format'
    
    if len(sequence)%3 != 0:
        return 'ERROR: number of nucleotides doesn\'t divide into 3'
    
    message = ''
    stop_codons_list = [key for key, value in codon_table.items() if value[0] == '*']
    existing_stop_codons = ''
    for codon in stop_codons_list:
        if codon in sequence:
            existing_stop_codons += codon +' '
    message = 'WARNING: sequence consists stop codons ' + existing_stop_codons if existing_stop_codons != '' else ''

    return message.strip()
    
@app.route('/')
def render_form():
    return render_template('index.html')

@app.route('/calc', method = ['POST'])
def calculate():
    file_ =  request.files['seq']
    mutate_first_codon = int(request.form['mutate'])
    codon_table = sn.get_codon_table(request.form['codon_table'])
    max_nmut = int(request.form['max_mutations'])

    records = {}
    for record in SeqIO.parse(file_.filename, "fasta"):
        records[record.id] = str(record.seq)

    result = {}
    for a in records:
        check = check_sequence(records[a], codon_table)
        if check.find('ERROR') == -1:
            result[a] = (sn.get_sequence_number(records[a], 
                                                mutate_first_codon, 
                                                max_nmut, 
                                                codon_table), check)
        else:
            result[a] = ('none', check)
        

    j = json.dumps(result)
    return j

if __name__ == '__main__':
    app.run()
