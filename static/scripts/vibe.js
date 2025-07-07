// 🌈 Load gradient from localStorage
const gradient1 = localStorage.getItem('gradient1') || '#6a11cb';
const gradient2 = localStorage.getItem('gradient2') || '#2575fc';

document.body.style.background = `linear-gradient(135deg, ${gradient1}, ${gradient2})`;
document.body.style.transition = 'background 1s ease';

// 🔑 Mood mapping
const moodKey = localStorage.getItem('mood') || 'stellar calm';
const mood_map = {
  "stellar calm": "ambient space",
  "solar drift": "lofi beats",
  "nebula pulse": "synthwave",
  "lunar isolation": "dark ambient",
  "galactic romance": "dream pop",
  "void stare": "post-rock",
  "aurora spark": "uplifting electronic",
  "cosmic surge": "space techno"
};

const displayMood = mood_map[moodKey] || "ambient space";
document.getElementById('mood').innerText = `Your cosmic vibe: ${displayMood}`;

// ✅ Define window.onSpotifyIframeApiReady globally ONCE
window.onSpotifyIframeApiReady = (IFrameAPI) => {
  const element = document.getElementById('embed-iframe');
  const options = { uri: '' }; // empty initially
  const callback = (EmbedController) => {
    // Store globally for later use
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
      // ✅ Use existing EmbedController to load new playlist
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

// 🚀 Call to load playlist on page load
loadSpotifyPlaylist(displayMood);
