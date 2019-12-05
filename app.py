from flask import Flask, request, render_template, json
import sequence_number as sn
import os
from Bio import SeqIO

app = Flask(__name__)

@app.route('/')
def render_form():
    return render_template('index.html')

@app.route('/calc', methods = ['POST'])
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
        result[a] = sn.get_sequence_number(records[a], mutate_first_codon, max_nmut, codon_table)

    j = json.dumps(result)
    return j

if __name__ == '__main__':
    app.run()
