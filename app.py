from flask import Flask, render_template, send_from_directory, jsonify, request, redirect, session
import requests
import google.generativeai as genai
import json
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from dotenv import load_dotenv
import os
load_dotenv()

SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")

sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(
    client_id=SPOTIFY_CLIENT_ID,
    client_secret=SPOTIFY_CLIENT_SECRET
))


app = Flask(__name__, static_folder='static', template_folder='templates')
app.secret_key = 'MRCODES'  # Replace with a strong secret for session security

NASA_API_KEY = os.getenv("NASA_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


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
    "and describe the overall mood of the image in one word using this mood map="
  "stellar calm,solar drit, nebula pulse,   lunar isolation, galactic romance,   void stare,   aurora spark,  cosmic surge"
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


@app.route('/api/search-playlist/<query>')
def search_playlist(query):
    try:
        results = sp.search(q=query, type='playlist', limit=1)
        if results['playlists']['items']:
            playlist_uri = results['playlists']['items'][0]['uri']
            return jsonify({'playlist_uri': playlist_uri})
        else:
            return jsonify({'error': 'No playlist found'})
    except Exception as e:
        print("Spotify search error:", e)
        return jsonify({'error': 'Spotify API error'})
    










if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)


    
