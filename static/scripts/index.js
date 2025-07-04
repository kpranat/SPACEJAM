const NASA_API_KEY = 'ztujhZBLrAEeGzvnwIWsa5kE9WeXBBBhspcFrHfo'; // Replace with your actual NASA API key

document.getElementById('fetch-go-btn').addEventListener('click', async () => {
  try {
    const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`);
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();

    localStorage.setItem('spaceImage', data.url);
    localStorage.setItem('title', data.title);
    localStorage.setItem('description', data.explanation);

    document.body.style.backgroundImage = `url('${data.url}')`;
    document.getElementById('apod-title').innerText = data.title;
    document.getElementById('apod-description').innerText = data.explanation;

    // Automatically redirect to next page after fetching
    window.location.href = 'vibe.html'; // Replace with your actual target page
  } catch (error) {
    console.error(error);
    alert('Failed to fetch NASA data. Check API key or network connection.');
  }
});
