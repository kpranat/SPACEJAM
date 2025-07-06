const GIPHY_API_KEY = 'YOUR_API_KEY'; // Replace with your Giphy API key

const gradient1 = localStorage.getItem('gradient1');
const gradient2 = localStorage.getItem('gradient2');

if (gradient1 || gradient2) {
  document.body.style.background = `linear-gradient(135deg, ${gradient1}, ${gradient2})`;
}

const bg = localStorage.getItem('spaceImage');
const title = localStorage.getItem('title');
const desc = localStorage.getItem('description');


if (bg) {
 // document.body.style.backgroundImage = `url('${bg}')`;
}
document.getElementById('vibe-title').innerText = title || '';
document.getElementById('vibe-desc').innerText = desc || '';

const keyword = extractKeyword(`${title} ${desc}`);

async function fetchGif() {
  try {
    const res = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(keyword)}&limit=1`);
    const data = await res.json();
    const gifUrl = data.data[0]?.images?.downsized_medium?.url;

    if (gifUrl) {
      document.getElementById('gif-preview').innerHTML = `<img src="${gifUrl}" alt="${keyword} GIF" />`;
    } else {
      document.getElementById('gif-preview').innerHTML = `<p>No related GIF found.</p>`;
    }
  } catch (err) {
    console.error('GIF fetch error:', err);
    document.getElementById('gif-preview').innerHTML = `<p>Failed to load GIF.</p>`;
  }
}

function extractKeyword(text) {
  const moodMap = {
    'explosion': 'edm',
    'nebula': 'nebula',
    'galaxy': 'galaxy',
    'sun': 'sun',
    'eclipse': 'eclipse',
    'moon': 'moon',
    'black hole': 'black hole',
    'stars': 'stars'
  };
  text = (text || '').toLowerCase();
  for (let word in moodMap) {
    if (text.includes(word)) return moodMap[word];
  }
  return 'space';
}

fetchGif();



const playBtn = document.getElementById("play-btn");
const pauseBtn = document.getElementById("pause-btn");

playBtn.addEventListener("click", () => {
  playSpotifyTrack();
});

pauseBtn.addEventListener("click", () => {
  pauseSpotify();
});

function playSpotifyTrack() {
  if (window.spotifyDeviceId && window.spotifyAccessToken && window.spotifyTrackUri) {
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${window.spotifyDeviceId}`, {
      method: 'PUT',
      body: JSON.stringify({ uris: [window.spotifyTrackUri] }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${window.spotifyAccessToken}`
      },
    }).catch(err => console.error('Play error:', err));
  }
}

function pauseSpotify() {
  if (window.spotifyAccessToken) {
    fetch('https://api.spotify.com/v1/me/player/pause', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${window.spotifyAccessToken}`
      }
    }).catch(err => console.error('Pause error:', err));
  }
}


