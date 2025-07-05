from flask import Flask, render_template, send_from_directory, jsonify, request, redirect, session
import requests
import google.generativeai as genai
import json
import base64
import os
import random

app = Flask(__name__, static_folder='static', template_folder='templates')
app.secret_key = 'MRCODES'  # Replace with a strong secret for session security

NASA_API_KEY = "ztujhZBLrAEeGzvnwIWsa5kE9WeXBBBhspcFrHfo"
GEMINI_API_KEY = "AIzaSyCqIQGLw63gnJ1X2Jk4GRd-LUjTG9kIsYQ"

genai.configure(api_key=GEMINI_API_KEY)

# Spotify config
SPOTIFY_CLIENT_ID = 'ce0d57489375419f9a6401e35f26542b'
SPOTIFY_CLIENT_SECRET = 'c1474458a85d48e9848fb1f893deee70'
SPOTIFY_REDIRECT_URI = 'http://127.0.0.1:5000/callback'
SCOPE = "streaming user-read-email user-read-private user-modify-playback-state user-read-playback-state"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/vibe.html')
def vibe():
    return render_template('vibe.html')

@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory(app.static_folder, filename)

# 🔭 NASA APOD route
@app.route('/api/apod')
def apod():
    nasa_url = f'https://api.nasa.gov/planetary/apod?api_key={NASA_API_KEY}'
    r = requests.get(nasa_url)
    return jsonify(r.json())

# 🌈 Gemini analysis route
@app.route('/api/analyze-image', methods=['POST'])
def analyze_image():
    data = request.get_json()
    image_url = data.get('imageUrl')

    model = genai.GenerativeModel('gemini-1.5-flash')
    prompt = (
    "Given this image, extract two HEX color codes that would make a good CSS radial gradient background, "
    "and describe the overall mood of the image in one word (like 'calm', 'energetic', 'mysterious', etc). "
    "Respond as JSON: {\"gradient\": [\"#hex1\", \"#hex2\"], \"mood\": \"moodword\"}"
    )
    try:
        response = model.generate_content([prompt, image_url])
        text = response.text.strip()
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

# 🎵 Spotify OAuth flow
@app.route('/login-spotify')
def login_spotify():
    auth_url = (
        'https://accounts.spotify.com/authorize'
        f'?response_type=code'
        f'&client_id={SPOTIFY_CLIENT_ID}'
        f'&scope={SCOPE}'
        f'&redirect_uri={SPOTIFY_REDIRECT_URI}'
    )
    return redirect(auth_url)

@app.route('/callback')
def callback():
    code = request.args.get('code')
    error = request.args.get('error')
    if error:
        return f"Error: {error}"

    auth_str = f"{SPOTIFY_CLIENT_ID}:{SPOTIFY_CLIENT_SECRET}"
    b64_auth_str = base64.b64encode(auth_str.encode()).decode()

    headers = {
        "Authorization": f"Basic {b64_auth_str}",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": SPOTIFY_REDIRECT_URI
    }

    r = requests.post("https://accounts.spotify.com/api/token", headers=headers, data=data)
    token_data = r.json()
    session['spotify_token'] = token_data

    return redirect('/vibe.html')

@app.route('/token')
def get_token():
    token_data = session.get('spotify_token')
    if not token_data:
        return jsonify({'error': 'No token found'}), 401
    return jsonify(token_data)

# 🎶 Mood to track URI mapping API
@app.route('/api/mood-track/<mood>')
def mood_to_track(mood):
    mood_track_map = {
        'calm': 'spotify:track:7ouMYWpwJ422jRcDASZB7P',
        'energetic': 'spotify:track:5ihS6UUlyQAfmp48eSkxuQ',
        'mysterious': 'spotify:playlist:38329cfad0564f15',
        'space': 'spotify:track:5N5k9nd479b1xpDZ4usjrg'
    }
    track_uri = mood_track_map.get(mood.lower(), 'spotify:track:5N5k9nd479b1xpDZ4usjrg')
    return jsonify({'track_uri': track_uri})

import os

if __name__ == "_main_":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
