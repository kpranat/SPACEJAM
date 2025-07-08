// 🌈 Load gradient from localStorage
const gradient1 = localStorage.getItem('gradient1') || '#6a11cb';
const gradient2 = localStorage.getItem('gradient2') || '#2575fc';

// 🔑 Mood mapping
const moodKey = localStorage.getItem('mood') || 'stellar calm';
const mood_map = {
  "stellar calm": "deep focus",
  "solar drift": "lofi beats",
  "nebula pulse": "synthwave",
  "lunar isolation": "dark ambient",
  "galactic romance": "dream pop",
  "void stare": "post-rock",
  "aurora spark": "uplifting electronic",
  "cosmic surge": "space techno"
};

const displayMood = mood_map[moodKey] || "ambient space";

// ✅ Define window.onSpotifyIframeApiReady globally ONCE
window.onSpotifyIframeApiReady = (IFrameAPI) => {
  const element = document.getElementById('embed-iframe');
  const options = { uri: '' }; // initially blank
  const callback = (EmbedController) => {
    window.embedController = EmbedController;
  };
  IFrameAPI.createController(element, options, callback);
};

// 🌌 Function to load playlist based on mood
async function loadSpotifyPlaylist(moodQuery) {
  try {
    const res = await fetch(`/api/search-playlist/${encodeURIComponent(moodQuery)}`);
    const data = await res.json();
    if (data.playlist_uri) {
      if (window.embedController) {
        window.embedController.loadUri(data.playlist_uri);
      } else {
        console.error("Spotify embed controller not initialized yet.");
      }
    } else {
      console.error("No playlist found for mood:", moodQuery);
    }
  } catch (err) {
    console.error("Error fetching playlist:", err);
  }
}

// ⏳ Show loader for 1.5s before revealing content
setTimeout(() => {
  document.getElementById("loader").style.display = "none";
  document.getElementById("content").style.display = "block";

  // 🎨 Set background and mood
  document.body.style.background = `linear-gradient(135deg, ${gradient1}, ${gradient2})`;
  document.body.style.transition = 'background 1s ease';
  document.getElementById('mood').innerText = `Your cosmic vibe: ${displayMood}`;

  // 🎵 Load Spotify after content is visible
  loadSpotifyPlaylist(displayMood);

}, 1500);
