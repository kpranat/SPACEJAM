const NASA_API_KEY = 'ztujhZBLrAEeGzvnwIWsa5kE9WeXBBBhspcFrHfo';
const GIPHY_API_KEY = 'OiPHToG85RiP5N8JNgCnGwBil2IyE3UN';

document.getElementById('vibe-btn').addEventListener('click', getSpaceVibe);

async function getSpaceVibe() {
  try {
    // 1. Fetch NASA APOD
    const nasaRes = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`);
    const apod = await nasaRes.json();

    document.getElementById('apod-title').innerText = apod.title || 'Space Picture';
    document.getElementById('apod-description').innerText = apod.explanation || '';

    if (apod.url && apod.media_type === 'image') {
      document.body.style.backgroundImage = `url('${apod.url}')`;
    } else {
      document.body.style.backgroundImage = '';
    }

    // 2. Extract keyword
    const keyword = extractKeyword(apod.title + ' ' + apod.explanation);

    // 3. Embed real Spotify playlist
    const spotifyPlayer = document.getElementById('spotify-player');
    const playlistMap = {
      edm: '37i9dQZF1DX4dyzvuaRJ0n',      // EDM
      ambient: '37i9dQZF1DWXRqgorJj26U',  // Ambient
      lofi: '37i9dQZF1DXdLenuyllTuh',     // Lofi
      jazz: '37i9dQZF1DXbITWG1ZJKYt',     // Jazz
      classical: '37i9dQZF1DWWEJlAGA9gs0',// Classical
      space: '37i9dQZF1DWYAcBZSAVhlf'     // Space-themed
    };

    const playlistId = playlistMap[keyword] || playlistMap.space;

    spotifyPlayer.innerHTML = `
      <iframe style="border-radius:12px"
        src="https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator"
        width="100%" height="152" frameborder="0" allowfullscreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy">
      </iframe>
    `;

    // 4. Giphy GIF
    const gifRes = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${keyword}&limit=1`);
    const gifData = await gifRes.json();
    const gifUrl = gifData.data[0]?.images?.original?.url;

    document.getElementById('gif-container').innerHTML = gifUrl
      ? `<img src="${gifUrl}" alt="${keyword} gif" />`
      : `<p>No GIF found for "${keyword}"</p>`;

  } catch (error) {
    console.error('Error fetching vibe:', error);
    alert('Something went wrong while fetching your cosmic vibe.');
  }
}

function extractKeyword(text) {
  const moodMap = {
    'explosion': 'edm',
    'nebula': 'ambient',
    'galaxy': 'lofi',
    'sun': 'jazz',
    'eclipse': 'classical'
  };
  text = text.toLowerCase();
  for (let word in moodMap) {
    if (text.includes(word)) return moodMap[word];
  }
  return 'space';
}