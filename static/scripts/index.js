document.getElementById('fetch-btn').addEventListener('click', async () => {
  const res = await fetch('/api/apod');
  const data = await res.json();

  localStorage.setItem('spaceImage', data.url);
  localStorage.setItem('title', data.title);
  localStorage.setItem('description', data.explanation);

  document.body.style.backgroundImage = `url('${data.url}')`;
  document.getElementById('apod-title').innerText = data.title;
  document.getElementById('apod-description').innerText = data.explanation;

  document.getElementById('go-btn').style.display = 'inline-block';

  document.getElementById("apod-title").classList.add("show");
  document.getElementById("apod-description").classList.add("show");

  document.getElementById('fetch-btn').style.display = 'none';
});

document.getElementById('go-btn').addEventListener('click', () => {
  window.location.href = 'vibe.html';
});