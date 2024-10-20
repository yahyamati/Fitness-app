from flask import Flask , request , jsonify , make_response
from flask_cors import CORS
Flask-PyMongo



app = Flask(__name__)
CORS(app)

note = []

@app.route('/api/notes', methods=['POST'])

def add_note():
    
    
    


