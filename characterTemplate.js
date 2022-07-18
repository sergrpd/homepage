const characterTemplate = ({
  id,
  image,
  name,
  species,
  gender,
  status,
  origin,
  location,
  created,
  url,
  episode,
}) => {
  const episodesList = episode
    .map((item) =>
      item.replaceAll('https://rickandmortyapi.com/api/episode/', '')
    )
    .join(', ');

  return `	  
    <article class="character-card" data-id=${id}>
      <table>
        <button type="button" data-id="${id}" class="button delete">Delete</button>
        <tr>
          <td>
            <img class="character-image" src="${image}" alt="${id} ${name}" />
          </td>

          <td>
            <div class="character-name">${name}</div>
            <div class="character-info">
              <span>Personal Info</span>
              <div class="character-info-item">Species: ${species}</div>
              <div class="character-info-item">Gender: ${gender}</div>
              <div class="character-info-item">Status: ${status}</div>
              <div class="character-info-item">Origin: <a href="${origin.url}">${origin.name}</a></div>
              <div class="character-info-item">Last known location: <a href="${location.url}">${location.name}</a></div>
              <div class="character-info-item">Created on: ${created}</div>
              <div class="character-info-item"><a href="${url}">Character Page</a></div>
            </div>
          </td>
        </tr>

        <tr>
          <td colspan=2>
            <span>Appearance</span>
            <div class="character-info-item">Appeared in ${episode.length} episode(s)</div>
            <div class="character-info-item">Episodes List: ${episodesList}</div>
          </td>
        </tr>
      </table>
    </article>
  `;
};

export default characterTemplate;
