let pointer = 0;

//-------------------- Top -----------------------

topButton = document.getElementById("topButton");

function scrollingButton() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      topButton.style.display = "block";
    } else {
      topButton.style.display = "none";
    }
  }

function goToTop() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function erase(node = document.getElementsByClassName("characters"), from = 0) {
   while (node.childElementCount > from) {
       node.removeChild(node.lastChild);
  }
}

//------------- Sort -----------------------
const sortEpisodeButton = document.querySelector('#sort_episodes>button');
const sortByEpisodesSelect = document.querySelector('#sort_episodes>select');

sortEpisodeButton.addEventListener('click', evt => {
  document.getElementsByClassName("characters").innerHTML = '';
  erase();
  fetch(`https://rickandmortyapi.com/api/character/`)
      .then(res => res.json())
      .then(data => {

        let characters = data.results;
        const pagesCount = data.info.pages;

        if (pagesCount > 1) {
          for (i = 2; i <= pagesCount; i++) {
            let page = i;
            fetch(`https://rickandmortyapi.com/api/character/?page=${i}`,{mode:'cors'})
              .then(res => res.json())
              .then(data => {
                characters = characters.concat(data.results);

                if (page === pagesCount) {
                  pointer = 0;

                  characters = sortingepisode(characters); // sort
                  visualize(characters);
                }
              })
          }
        } else {
          pointer = 0;
          console.log(characters);
          characters = sortingepisode(characters);
          visualize(characters);
        }
      })

});

function sortingdate(characters) {;

  if(document.getElementById('sort_date').selectedIndex == 'From new to old'){
    characters = characters.sort((a, b) => b.created - a.created );
  }else if(document.getElementById('sort_date').selectedIndex == 'From old to new'){
    characters = characters.sort((a, b) => a.created - b.created );
  }
  return characters;
}

function sortingepisode(characters) {;

  if(document.getElementById('sort_episodes').selectedIndex == 'From max to min'){
    characters = characters.sort((a, b) => b.episode.length - a.episode.length );
  }else if(document.getElementById('sort_episodes').selectedIndex == 'From min to max'){
    characters = characters.sort((a, b) => a.episode.length - b.episode.length );
  }
  return characters;
}


//---------------- Get Data -----------------------

    function getElements(){
      fetch(`https://rickandmortyapi.com/api/character/`)
      .then(res => res.json())
      .then(data => {

        let characters = data.results;
        const pagesCount = data.info.pages;

        if (pagesCount > 1) {
          for (i = 2; i <= pagesCount; i++) {
            let page = i;
            fetch(`https://rickandmortyapi.com/api/character/?page=${i}`)
              .then(res => res.json())
              .then(data => {
                characters = characters.concat(data.results);
                if (page === pagesCount) {
                  pointer = 0;
                  visualize(characters);
                }
              })
          }
        } else {
          pointer = 0;
          visualize(characters);
        }
      })
    }
    getElements();

//----------------------- Search ---------------------
  const search = document.querySelector('#quick-search'),
  charactersOutput = document.querySelector('.characters');

  let searchString = '',
  output = '';

  search.addEventListener('keyup', debounce(() => {

    charactersOutput.innerHTML = '';

    output = '';

    searchString = search.value.replace(' ', '+');

    fetch(`https://rickandmortyapi.com/api/character/?name=${searchString}`)
      .then(res => res.json())
      .then(data => {

        let characters = data.results;

        const pagesCount = data.info.pages;

        if (pagesCount > 1) {
          for (i = 2; i <= pagesCount; i++) {
            let page = i;
            fetch(`https://rickandmortyapi.com/api/character/?page=${i}&name=${searchString}`)
              .then(res => res.json())
              .then(data => {
                characters = characters.concat(data.results);

                if (page === pagesCount) {
                  pointer = 0;
                  visualize(characters);
                }
              })
          }
        } else {
          pointer = 0;
          visualize(characters);
        }
      })
      .catch(err => {
        charactersOutput.innerHTML = `<p class="no-results">No Results Found</p>`;
      })
  }));

//------------------------ Display ------------------

  function show(character) {

      var allepisodes = character.episode;
      allepisodes = allepisodes.join('');
      var ep = allepisodes.replace(/https:\/+/g, '');
	  ep = ep.replace(/rickandmortyapi.com\//g, '');
      ep = ep.replace(/api\//g, '');
      ep = ep.replace(/episode\//g, ' ');

      output +=
      `	  
	  	  <article class="character-card">
	  <table>
	  		        <button type="button" class="delbtn" id="delete" onclick="this.parentNode.style.display = 'none';">Delete</button>
		<tr>
		<td>
        <img class="character-image" src="${character.image}" alt="${character.id} ${character.name}" />
		</td>
		<td>
        <div class="character-name">${character.name}</div>
		<div class="character-info">
		 <span>Personal Info</span>
          <div class="character-info-item">Species: ${character.species}</div>
          <div class="character-info-item">Gender: ${character.gender}</div>
          <div class="character-info-item">Status: ${character.status}</div>
		  <div class="character-info-item">Origin: <a href="${character.origin.url}">${character.origin.name}</a></div>
		  <div class="character-info-item">Last known location: <a href="${character.location.url}">${character.location.name}</a></div>
          <div class="character-info-item">Created on: ${character.created}</div>
		  <div class="character-info-item"><a href="${character.url}">Character Page</a></div>
		  </div>
		  </td>
		  </tr>
		  <tr>
		  <td colspan=2>
		  <span>Appearance</span>
          <div class="character-info-item">Appeared in ${character.episode.length} episode(s)</div>
		  <div class="character-info-item">Episodes List: ${ep}</div>
		</td>
		</tr>
		</table>
      </article>
	  `;

    charactersOutput.innerHTML = output;
  }

//-------------------------------------------------------------

  function debounce(func, wait = 900, immediate) {
    let timeout;
    return () => {
      const context = this,
      args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
      timeout = null;
        if (!immediate) func.apply(context, args);
      }, wait);
      if (immediate && !timeout) func.apply(context, args);
    };
  }

//--------------- Visualize ----------------------------------------------------

  function visualize(mass) {
    let pagecounter = 10;
    for ( let i = pointer; i < pointer + pagecounter; i++) {
          show(mass[i]);
        }
    pointer += pagecounter;
    window.onscroll = function() {
      scrolling(mass);
      scrollingButton();
    };
  }

//------------------- Scrolling ------------------------------------------------

  function scrolling(mass) {
    let maxScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let currentScroll = window.pageYOffset;
    if( currentScroll  ==  maxScroll ) {
      visualize(mass);
    }
  }
