import characterTemplate from './characterTemplate.js';

const refs = {
  window,
  charactersList: document.querySelector('.characters'),
  topButton: document.querySelector('.top-button'),
  loader: document.querySelector('.loader'),
  inputSearch: document.querySelector('.search'),
};

let items = [];
let query = '';
let page = 1;
let pages = 0;
let isLoading = false;

// -------------- functions ----------------
/** fetch characters data from API */
function fetchCharacters(page = 1) {
  return fetch(`https://rickandmortyapi.com/api/character?page=${page}`).then(
    (res) => res.json()
  );
}

/** renders the characters list to the DOM */
function render(emptyBeforeRender = false) {
  const list = items
    .filter((item) =>
      query ? item.name.toLowerCase().includes(query.toLowerCase()) : true
    )
    .slice((page - 1) * 10, page * 10)
    .map(characterTemplate)
    .join('');

  if (emptyBeforeRender) {
    refs.charactersList.innerHTML = '';
  }
  refs.charactersList.insertAdjacentHTML('beforeend', list);
}

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
    pages = info.pages;
    items = results;
  });

  const fetches = [];
  for (let i = 2; i <= pages; i += 1) {
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

  if (refs.window.pageYOffset >= scrollHeight - clientHeight && page < pages) {
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

function handleSearchInput(e) {
  query = e.target.value;
  render(true);
}

// -------------- event listeners ----------------
refs.window.addEventListener('scroll', handleWindowScroll);
refs.topButton.addEventListener('click', handleTopClick);
refs.charactersList.addEventListener('click', handleCharacterClick);
refs.inputSearch.addEventListener('input', handleSearchInput);

// ------------------- run -----------------------
loadCharacters();
