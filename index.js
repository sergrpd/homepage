import characterTemplate from './characterTemplate.js';

const refs = {
  window,
  charactersList: document.querySelector('.characters'),
  topButton: document.querySelector('.top-button'),
  loader: document.querySelector('.loader'),
};

let page = 1;
let pages = 0;
let isLoading = false;

// -------------- functions ----------------
/** renders the characters list to the DOM */
function render(characters) {
  const list = characters.map(characterTemplate).join('');

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
function loadCharacters() {
  showLoader(true);

  fetch(`https://rickandmortyapi.com/api/character?page=${Math.floor(page)}`)
    .then((res) => res.json())
    .then(({ info, results = [] }) => {
      const fromIdx = Number.isInteger(page) ? 0 : 10;
      const characters = results.slice(fromIdx, 10);

      pages = info.pages;
      page += 0.5;

      render(characters);
    })
    .finally(() => {
      showLoader(false);
    });
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

  if (refs.window.pageYOffset >= scrollHeight - clientHeight) {
    loadCharacters();
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
    behavior: 'smooth',
  });
}

/** a callback function to call on Character Item click */
function handleCharacterClick({ target }) {
  const { nodeName, dataset } = target;

  // if it's a button then remove the item
  if (nodeName === 'BUTTON') {
    const item = document.querySelector(`article[data-id="${dataset.id}"]`);

    item.remove();
  }
}

// -------------- event listeners ----------------
refs.window.addEventListener('scroll', handleWindowScroll);
refs.topButton.addEventListener('click', handleTopClick);
refs.charactersList.addEventListener('click', handleCharacterClick);

// ------------------- run -----------------------
loadCharacters();
