document.getElementById('searchBtn').addEventListener('click', () => {
    const query = document.getElementById('search').value;
    const searchType = document.getElementById('searchType').value;
    fetchAnimeAndManga(query, searchType);
  });
  
  let modalCallback;
  
  function openModal(text, callback) {
    document.getElementById('modalText').innerText = text;
    document.getElementById('modalInput').value = '';
    document.getElementById('modal').style.display = 'block';
    modalCallback = callback;
  }
  
  function closeModal() {
    document.getElementById('modal').style.display = 'none';
  }
  
  function confirmModal() {
    const input = document.getElementById('modalInput').value;
    if (modalCallback) {
      modalCallback(input);
    }
    closeModal();
  }
  
  async function fetchAnimeAndManga(query, type) {
    try {
      document.getElementById('recommended').style.display = 'none';
      document.getElementById('recommendedTitle').style.display = 'none';
  
      const response = await fetch(`https://api.jikan.moe/v4/${type}?q=${query}`);
  
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
  
      const data = await response.json();
      displayResults(data.data, type);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch data. Please try again later.');
    }
  }
  
  function displayResults(results, type) {
    const content = document.getElementById('content');
    content.innerHTML = '';
  
    if (!Array.isArray(results)) {
      console.error('Invalid data format:', results);
      return;
    }
  
    results.forEach(item => {
      const genres = item.genres ? item.genres.map(g => g.name).join(', ') : 'N/A';
      const producers = item.producers ? item.producers.map(p => p.name).join(', ') : 'N/A';
  
      const div = document.createElement('div');
      div.className = 'item';
      div.innerHTML = `
        <img src="${item.images?.jpg?.image_url || ''}" alt="${item.title}" width="100%">
        <h3>${item.title}</h3>
        <p>${item.synopsis || 'No synopsis available'}</p>
        <p>Score: ${item.score || 'N/A'}</p>
        <p>Rank: ${item.rank || 'N/A'}</p>
        <p>Popularity: ${item.popularity || 'N/A'}</p>
        <p>Genres: ${genres}</p>
        <p>Producers: ${producers}</p>
        <p>Source: ${item.source || 'N/A'}</p>
        <p>Rating: ${item.rating || 'N/A'}</p>
        <p>Release Date: ${item.aired ? item.aired.string : item.published?.string || 'N/A'}</p>
        <p><a href="${item.url}" target="_blank">More Info</a></p>
        <button onclick="addFavorite('${item.mal_id}', '${type}')">Add to Favorites</button>
        <button onclick="removeFavorite('${item.mal_id}', '${type}')">Remove from Favorites</button>
        <button onclick="openModal('Enter episode number:', (input) => markAsWatched('${item.mal_id}', '${item.title}', input))">Mark as Watched</button>
        <button onclick="openModal('Enter chapter number:', (input) => markAsRead('${item.mal_id}', '${item.title}', input))">Mark as Read</button>
      `;
      content.appendChild(div);
    });
  }
  
  async function fetchRecommendedAnime() {
    try {
      const response = await fetch(`https://api.jikan.moe/v4/recommendations/anime`);
  
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }
  
      const data = await response.json();
      displayRecommended(data.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  }
  
  function displayRecommended(recommendations) {
    const recommended = document.getElementById('recommended');
    recommended.innerHTML = '';
  
    recommendations.slice(0, 10).forEach(item => { // Limit to top 10 recommendations
      const div = document.createElement('div');
      div.className = 'recommendation';
      div.innerHTML = `
        <img src="${item.entry[0].images?.jpg?.image_url || ''}" alt="${item.entry[0].title}" width="100%">
        <h3>${item.entry[0].title}</h3>
        <p><a href="https://myanimelist.net/anime/${item.entry[0].mal_id}" target="_blank">More Info</a></p>
      `;
      recommended.appendChild(div);
    });
  }
  
  function addFavorite(id, type) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!Array.isArray(favorites)) {
      favorites = [];
    }
    favorites.push({ id, type });
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('Added to Favorites');
  }
  
  function removeFavorite(id, type) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!Array.isArray(favorites)) {
      favorites = [];
    }
    favorites = favorites.filter(favorite => !(favorite.id === id && favorite.type === type));
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('Removed from Favorites'); // removing from favorites
  }
  
  function markAsWatched(id, title, episode) {
    if (episode) {
      let watched = JSON.parse(localStorage.getItem('watched')) || [];
      if (!Array.isArray(watched)) {
        watched = [];
      }
      watched.push({ id, title, episode });
      localStorage.setItem('watched', JSON.stringify(watched));
      alert(`Marked as Watched: ${title} Episode ${episode}`);
    }
  }
  
  function markAsRead(id, title, chapter) {
    if (chapter) {
      let read = JSON.parse(localStorage.getItem('read')) || [];
      if (!Array.isArray(read)) {
        read = [];
      }
      read.push({ id, title, chapter });
      localStorage.setItem('read', JSON.stringify(read));
      alert(`Marked as Read: ${title} Chapter ${chapter}`);
    }
  }
  
  function removeWatched(id, episode) {
    let watched = JSON.parse(localStorage.getItem('watched')) || [];
    watched = watched.filter(item => !(item.id === id && item.episode === episode));
    localStorage.setItem('watched', JSON.stringify(watched));
    alert('Removed from Watched'); // remove watched episode
  }
  
  function removeRead(id, chapter) {
    let read = JSON.parse(localStorage.getItem('read')) || [];
    read = read.filter(item => !(item.id === id && item.chapter === chapter));
    localStorage.setItem('read', JSON.stringify(read));
    alert('Removed from Read'); // remove read chapter
  }
  
  // Fetch recommended anime when the page loads
  document.addEventListener('DOMContentLoaded', () => {
    fetchRecommendedAnime();
  });
  