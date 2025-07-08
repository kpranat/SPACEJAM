🚀 SPACEJAM
SPACEJAM is a Flask-based web application designed to play music on the basis of the astronomical photo of the day. This project is built with simplicity and scalability in mind, and is deployed seamlessly on Render.

🌟 Features
• Custom Loading States
• Dynamic Theming Based on API Data
• Multilingual Support
• Text-to-Speech for content
• Personalized Astronomical web interface
• Fast and lightweight backend using Flask
• Organized code with templates and static assets
• Easily deployable on Render

🛠️ Tech Stack
API USED
• NASA API – Used for image and description collection of ASTRONOMICAL PHOTO OF THE DAY (APOD)
• GEMINI API – to extract mood based color scheme and keywords through prompt engineering and visual processing
• GIHPY API – to display GIFs based on extracted keywords and moods
• SPOTIFY API – to provide and play playlists based on the extracted moods and keywords
• WEGLOT API – For multilingual support and translation
TECHNOLOGIES
• BACKEND - Python, Flask
• FRONTEND - HTML, CSS, JavaScript (vanilla)
• DEPLOYMENT - Render

REQUIREMENTS
You need api keys to work with. Replace "YOUR_API_KEY" with the api key you have generated
Replace spotify clied id("YOUR_CLIENT..") and client secret("YOUR_CLIENT..") with the ones you have geenerated.

📁 Project Structure
SPACEJAM/
├── app.py
├── requirements.txt
├── Procfile
├── static/
│   └── [CSS, JS, images]
├── templates/
│   └── [HTML files]
└── README.md

🚀 Installation
Clone the repository:
git clone https://github.com/kpranat/SPACEJAM.git
cd SPACEJAM
Create a virtual environment (recommended):
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
Install dependencies:
pip install -r requirements.txt
Run the application locally:
python app.py
Open your browser and go to http://localhost:5000

🌐 Deployment on Render
1. Create a Render account at https://render.com.
2. Connect your GitHub repository.
3. Create a new Web Service with:
   - Build Command: pip install -r requirements.txt
   - Start Command: python app.py
4. Add environment variables if required (e.g., FLASK_ENV=production).
5. Ensure your Procfile exists with: web: python app.py
6. Deploy and access your app via the Render-provided URL.

🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.

📜 License
This project is licensed under the MIT License.

💡 Author
👤 Pranat Kheria
- GitHub: @kpranat (https://github.com/kpranat)

👤 Krrish Verma
- GitHub: @kv24-eng (https://github.com/kv24-eng)
