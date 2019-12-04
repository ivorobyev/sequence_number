from flask import Flask, request, render_template, json
import sequence_number as sn

app = Flask(__name__)

@app.route('/')
def render_form():
    return render_template('index.html')

@app.route('/calc', methods = ['POST'])
def calculate():
    seq = request.form['sequence'].upper()
    mutate_first_codon = request.form['mutate']
    codon_table = sn.get_codon_table(request.form['codon_table'])
    max_nmut = request.form['max_mutations']
    s = sn.get_sequence_number(seq, mutate_first_codon, max_nmut, codon_table)
    return s

if __name__ == '__main__':
    app.run()
