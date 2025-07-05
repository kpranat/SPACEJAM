document.getElementById('fetch-btn').addEventListener('click', async () => {
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

  // Set background gradient
  document.body.style.background = `radial-gradient(circle at 50% 50%, ${analysis.gradient[0]}, ${analysis.gradient[1]})`;
  localStorage.setItem('gradient1', analysis.gradient[0]);
  localStorage.setItem('gradient2', analysis.gradient[1]);
  const mood = analysis.mood;

  // Set APOD title and description
  document.getElementById('apod-title').innerText = data.title;
  document.getElementById('apod-description').innerText = data.explanation;

  // Show the NASA image
  const img = document.getElementById('apod-image');
  img.src = data.url;
  img.style.display = 'block';

  document.getElementById('go-btn').style.display = 'inline-block';
  document.getElementById("apod-title").classList.add("show");
  document.getElementById("apod-description").classList.add("show");
  document.getElementById('fetch-btn').style.display = 'none';
});

document.getElementById('go-btn').addEventListener('click', () => {
  window.location.href = 'vibe.html';
});