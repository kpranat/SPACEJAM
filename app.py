from flask import Flask, render_template, send_from_directory, jsonify
import requests

app = Flask(__name__, static_folder='static', template_folder='templates')

NASA_API_KEY = "ztujhZBLrAEeGzvnwIWsa5kE9WeXBBBhspcFrHfo"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/vibe.html')
def vibe():
    return render_template('vibe.html')

@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory(app.static_folder, filename)

@app.route('/api/apod')
def apod():
    nasa_url = f'https://api.nasa.gov/planetary/apod?api_key={NASA_API_KEY}'
    r = requests.get(nasa_url)
    return jsonify(r.json())

if __name__ == '__main__':
    app.run(debug=True)