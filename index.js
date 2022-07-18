import characterTemplate from './characterTemplate.js';

/** references to the DOM elements */
const refs = {
  window,
  charactersList: document.querySelector('.characters'),
  topButton: document.querySelector('.top-button'),
  loader: document.querySelector('.loader'),
  inputSortByDate: document.querySelector('select[data-sort="date"]'),
  inputSortByEpisode: document.querySelector('select[data-sort="episodes"]'),
  inputSearch: document.querySelector('.search'),
};

let items = [];
let query = '';
let sortByDateValue = '';
let sortByEpisodeValue = '';
let page = 1;
let totalPages = 0;
let isLoading = false;

// -------------- functions ----------------
/** fetch characters data from API */
function fetchCharacters(page = 1) {
  return fetch(`https://rickandmortyapi.com/api/character?page=${page}`).then(
    (res) => res.json()
  );
}

/** sort items by date */
function sortByDate(list) {
  if (!sortByDateValue) return list;

  return [...list].sort((a, b) => {
    const date1 = new Date(a.created).getTime();
    const date2 = new Date(b.created).getTime();

    return sortByDateValue === 'desc' ? date2 - date1 : date1 - date2;
  });
}

/** sort items by episodes and date */
function sortByEpisodes(list) {
  if (!sortByEpisodeValue) return list;

  return [...list].sort((a, b) => {
    const date1 = new Date(a.created).getTime();
    const date2 = new Date(b.created).getTime();
    const value1 = a.episode.length;
    const value2 = b.episode.length;

    return sortByEpisodeValue === 'desc'
      ? value2 - value1 || date1 - date2
      : value1 - value2 || date1 - date2;
  });
}

/** renders the characters list to the DOM */
function render(emptyBeforeRender = false) {
  const sortedItemsByDate = sortByDate(items);
  const sortedItemsByEpisodes = sortByEpisodes(sortedItemsByDate);

  const list = sortedItemsByEpisodes
    .filter((item) => {
      const itemName = item.name.toLowerCase();
      const queryString = query.toLowerCase();

      return query ? itemName.includes(queryString) : true;
    })
    .slice((page - 1) * 10, page * 10)
    .map(characterTemplate)
    .join('');

  if (emptyBeforeRender) {
    refs.charactersList.innerHTML = '';
  }
  refs.charactersList.insertAdjacentHTML('beforeend', list);
}

/** show/hide the loader */
function showLoader(show = false) {
  isLoading = show;

  if (show) {
    refs.loader.classList.add('show');
  } else {
    refs.loader.classList.remove('show');
  }
}

/** fetch the characters list from the API */
async function loadCharacters() {
  showLoader(true);

  await fetchCharacters().then(({ info, results }) => {
    totalPages = info.pages;
    items = results;
  });

  const fetches = [];
  for (let i = 2; i <= totalPages; i += 1) {
    fetches.push(fetchCharacters(i));
  }

  const data = await Promise.all(fetches);
  data.forEach(({ results }) => items.push(...results));

  render();
  showLoader(false);
}

/** show/hide the topButton */
function toggleTopButton() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    refs.topButton.classList.add('show');
  } else {
    refs.topButton.classList.remove('show');
  }
}

/** initiate the rendering or loading of the next portion of characters */
function addCharacters() {
  const { scrollHeight, clientHeight } = document.documentElement;

  if (isLoading) return;

  if (
    refs.window.pageYOffset >= scrollHeight - clientHeight &&
    page < totalPages
  ) {
    page += 1;
    render();
  }
}

/** a callback function to call on window scroll
 * - show/hide the topButton;
 * - initiate the rendering of the next portion of characters;
 */
function handleWindowScroll() {
  toggleTopButton();
  addCharacters();
}

/** a callback function to call on Top Button click
 * - scrolls up the window to the top;
 */
function handleTopClick() {
  refs.window.scrollTo({
    top: 0,
    left: 0,
  });
  page = 1;
  render(true);
}

/** a callback function to call on Character Item click */
function handleCharacterClick({ target }) {
  const { nodeName, dataset } = target;

  // if it's a button then remove the item from the DOM and from the models
  if (nodeName === 'BUTTON') {
    const item = document.querySelector(`article[data-id="${dataset.id}"]`);

    items = items.filter(({ id }) => id !== Number(dataset.id));
    item.remove();
  }
}

/** set the search query value and rerender the page */
function handleSearchInput(e) {
  query = e.target.value;
  render(true);
}

/** set the Sort By Date value and rerender the page */
function handleChangeSortByDate(e) {
  sortByDateValue = e.target.value;
  render(true);
}

/** set the Sort By Episode value and rerender the page */
function handleChangeSortByEpisode(e) {
  sortByEpisodeValue = e.target.value;
  render(true);
}

// -------------- event listeners ----------------
refs.window.addEventListener('scroll', handleWindowScroll);
refs.topButton.addEventListener('click', handleTopClick);
refs.charactersList.addEventListener('click', handleCharacterClick);
refs.inputSearch.addEventListener('input', handleSearchInput);
refs.inputSortByDate.addEventListener('change', handleChangeSortByDate);
refs.inputSortByEpisode.addEventListener('change', handleChangeSortByEpisode);

// ------------------- run -----------------------
loadCharacters();
