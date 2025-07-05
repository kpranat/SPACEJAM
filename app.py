from flask import Flask, render_template, send_from_directory, jsonify, request
import requests
import google.generativeai as genai
import json

app = Flask(__name__, static_folder='static', template_folder='templates')

NASA_API_KEY = "ztujhZBLrAEeGzvnwIWsa5kE9WeXBBBhspcFrHfo"
GEMINI_API_KEY = "AIzaSyCqIQGLw63gnJ1X2Jk4GRd-LUjTG9kIsYQ"  # <-- Replace with your Gemini API key

genai.configure(api_key=GEMINI_API_KEY)

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

@app.route('/api/analyze-image', methods=['POST'])
def analyze_image():
    data = request.get_json()
    image_url = data.get('imageUrl')

    # Use Gemini to analyze the image
    model = genai.GenerativeModel('gemini-1.5-flash')
    prompt = (
        "Given this image, extract two dominant HEX color codes that would make a good CSS linear gradient background, "
        "and describe the overall mood of the image in one word (like 'calm', 'energetic', 'mysterious', etc). "
        "Respond as JSON: {\"gradient\": [\"#hex1\", \"#hex2\"], \"mood\": \"moodword\"}"
    )
    try:
        response = model.generate_content([prompt, image_url])
        # Try to extract JSON from the response
        text = response.text.strip()
        # If Gemini returns markdown code block, extract JSON part
        if "```json" in text:
            text = text.split("```json")[-1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[-1].strip()
        result = json.loads(text)
    except Exception as e:
        print("Gemini API error:", e)
        result = {
            "gradient": ["#C1C4ED", "#0d47a1"],
            "mood": "calm"
        }
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)