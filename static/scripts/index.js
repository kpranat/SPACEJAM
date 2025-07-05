document.getElementById('fetch-btn').addEventListener('click', async () => {
  const loader = document.getElementById('loading-screen');
  const progress = document.querySelector('.loading-progress');

  
  // Reset animation
  progress.style.animation = 'none';
  progress.offsetHeight; // trigger reflow
  progress.style.animation = 'loadbar 1s forwards';

  loader.classList.add('show');
  const startTime = Date.now();

  try {
    const res = await fetch('/api/apod');
    const data = await res.json();

    localStorage.setItem('spaceImage', data.url);
    localStorage.setItem('title', data.title);
    localStorage.setItem('description', data.explanation);

    const response = await fetch('/api/analyze-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl: data.url })
    });
    const analysis = await response.json();

    document.body.style.background = `radial-gradient(circle at 50% 50%, ${analysis.gradient[0]}, ${analysis.gradient[1]})`;
    localStorage.setItem('gradient1', analysis.gradient[0]);
    localStorage.setItem('gradient2', analysis.gradient[1]);

    document.getElementById('apod-title').innerText = data.title;
    document.getElementById('apod-description').innerText = data.explanation;

    const img = document.getElementById('apod-image');
    img.src = data.url;
    img.style.display = 'block';

    document.getElementById('go-btn').style.display = 'inline-block';
    document.getElementById("apod-title").classList.add("show");
    document.getElementById("apod-description").classList.add("show");
    document.getElementById('speak-btn').style.display = 'inline-block';

    document.getElementById('fetch-btn').style.display = 'none';

    const elapsed = Date.now() - startTime;
    const delay = Math.max(1000 - elapsed, 0);

    setTimeout(() => {
      loader.classList.remove('show');
    }, delay);

  } catch (error) {
    console.error("Error fetching data:", error);
    loader.classList.remove('show');
  }
});




document.getElementById('go-btn').addEventListener('click', () => {
  window.location.href = 'vibe.html';
});






let isSpeaking = false;
let currentUtterance = null;

document.getElementById('speak-btn').addEventListener('click', () => {
  const description = document.getElementById('apod-description').innerText;

  if (!isSpeaking) {
    currentUtterance = new SpeechSynthesisUtterance(description);
    currentUtterance.lang = 'en-US';

    // When speaking ends
    currentUtterance.onend = () => {
      isSpeaking = false;
      document.getElementById('speak-btn').innerText = '🔊 Speak';
    };

    speechSynthesis.speak(currentUtterance);
    isSpeaking = true;
    document.getElementById('speak-btn').innerText = '⏹ Stop';
  } else {
    speechSynthesis.cancel();
    isSpeaking = false;
    document.getElementById('speak-btn').innerText = '🔊 Speak';
  }
});

// Stop speaking if user leaves the page
window.addEventListener('beforeunload', () => {
  speechSynthesis.cancel();
})