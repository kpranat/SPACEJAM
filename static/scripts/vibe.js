const GIPHY_API_KEY = 'OiPHToG85RiP5N8JNgCnGwBil2IyE3UN'; // Replace with your Giphy API key

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

const audio = document.getElementById("cosmic-audio");
  const playBtn = document.getElementById("play-btn");
  const pauseBtn = document.getElementById("pause-btn");

  playBtn.addEventListener("click", () => {
    audio.play();
  });

  pauseBtn.addEventListener("click", () => {
    audio.pause();
  });
