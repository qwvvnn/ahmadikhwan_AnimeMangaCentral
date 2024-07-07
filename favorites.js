window.addEventListener('DOMContentLoaded', () => {
  displayFavorites();
  displayWatched();
  displayRead();
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

async function displayFavorites() {
  const content = document.getElementById('content');
  content.innerHTML = '';

  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  for (const favorite of favorites) {
    const response = await fetch(`https://api.jikan.moe/v4/${favorite.type.toLowerCase()}/${favorite.id}`);
    const data = await response.json();
    const item = data.data;

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
      <button onclick="removeFavorite('${item.mal_id}', '${favorite.type}')">Remove from Favorites</button>
    `;
    content.appendChild(div);
  }
}

function removeFavorite(id, type) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  if (!Array.isArray(favorites)) {
    favorites = [];
  }
  favorites = favorites.filter(favorite => !(favorite.id === id && favorite.type === type));
  localStorage.setItem('favorites', JSON.stringify(favorites));
  alert('Removed from Favorites');
  displayFavorites(); // Refresh the favorites list
}

async function displayWatched() {
  const content = document.getElementById('watchedContent');
  content.innerHTML = '';

  const watched = JSON.parse(localStorage.getItem('watched')) || [];

  for (const watch of watched) {
    const response = await fetch(`https://api.jikan.moe/v4/anime/${watch.id}`);
    const data = await response.json();
    const item = data.data;

    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <img src="${item.images?.jpg?.image_url || ''}" alt="${watch.title}" width="100%">
      <h3>${watch.title}</h3>
      <p>Episode: ${watch.episode}</p>
      <p>Review: ${watch.review || 'No review available'}</p>
      <button onclick="removeWatched('${watch.id}', '${watch.episode}')">Remove Watched Episode</button>
      <button onclick="editWatchedReview('${watch.id}', '${watch.episode}')">Edit Review</button>
    `;
    content.appendChild(div);
  }
}

function removeWatched(id, episode) {
  let watched = JSON.parse(localStorage.getItem('watched')) || [];
  watched = watched.filter(item => !(item.id === id && item.episode === episode));
  localStorage.setItem('watched', JSON.stringify(watched));
  alert('Removed from Watched');
  displayWatched(); // Refresh the watched list
}

function editWatchedReview(id, episode) {
  openModal('Edit Review', (review) => {
    let watched = JSON.parse(localStorage.getItem('watched')) || [];
    for (let item of watched) {
      if (item.id === id && item.episode === episode) {
        item.review = review;
        break;
      }
    }
    localStorage.setItem('watched', JSON.stringify(watched));
    displayWatched();
  });
}

async function displayRead() {
  const content = document.getElementById('readContent');
  content.innerHTML = '';

  const read = JSON.parse(localStorage.getItem('read')) || [];

  for (const readItem of read) {
    const response = await fetch(`https://api.jikan.moe/v4/manga/${readItem.id}`);
    const data = await response.json();
    const item = data.data;

    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <img src="${item.images?.jpg?.image_url || ''}" alt="${readItem.title}" width="100%">
      <h3>${readItem.title}</h3>
      <p>Chapter: ${readItem.chapter}</p>
      <p>Review: ${readItem.review || 'No review available'}</p>
      <button onclick="removeRead('${readItem.id}', '${readItem.chapter}')">Remove Read Chapter</button>
      <button onclick="editReadReview('${readItem.id}', '${readItem.chapter}')">Edit Review</button>
    `;
    content.appendChild(div);
  }
}

function removeRead(id, chapter) {
  let read = JSON.parse(localStorage.getItem('read')) || [];
  read = read.filter(item => !(item.id === id && item.chapter === chapter));
  localStorage.setItem('read', JSON.stringify(read));
  alert('Removed from Read');
  displayRead(); // Refresh the read list
}

function editReadReview(id, chapter) {
  openModal('Edit Review', (review) => {
    let read = JSON.parse(localStorage.getItem('read')) || [];
    for (let item of read) {
      if (item.id === id && item.chapter === chapter) {
        item.review = review;
        break;
      }
    }
    localStorage.setItem('read', JSON.stringify(read));
    displayRead();
  });
}
