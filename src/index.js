import './css/styles.css';
import getRefs from './js/refs';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = getRefs();

refs.inputSearch.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

/**
 * Function listens event on input
 * @param {object} event
 * @returns cleared HTML
 */
function onSearch(e) {
  const value = e.target.value.trim();

  if (!value) {
    clearRender();
    return;
  }

  /**
   * Function fetchs data from the server
   * return promise
   */
  fetchCountries(e.target.value)
    .then(country => {
      if (country.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      } else if (country.length > 2 && country.length < 10) {
        clearRender();

        return renderCountryList(country);
      } else {
        clearRender();

        return renderCountryInfo(country);
      }
    })
    .catch(err => {
      if ((err.statusCode = '404')) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      }
      return;
    });
}

/**
 * Function creates HTML for countries
 * @param {array, object} country
 * return HTML rendering
 */
function renderCountryList(country) {
  const markup = country.map(
    ({
      name: { official },
      flags: { svg: flag },
    }) => `<li class="country__list">
            <img class="country__image" src="${flag}" alt="${official}" width="35" height="20"><span class="country__text">${official}</span>
    </li>`
  );

  refs.list.insertAdjacentHTML('beforeend', markup.join(''));
}

/**
 * Function creates HTML info block for a country
 * @param {object, array} country
 * return HTML rendering
 */
function renderCountryInfo(country) {
  const markup = country.map(
    ({ name, capital, population, flags, languages }) => {
      return `<div class="country__box">
    <img class="country__image" src="${flags.svg}" alt="${
        name.official
      }" width="55" height="50"><span class="country__title">${
        name.official
      }</span></div>
    <ul class="country__items">
      <li>
        <h2 class="country__block">Capital: <span class="country__text">${capital}</span></h2>
        </li>
        <li>
        <h2 class="country__block">Population: <span class="country__text">${population}</span></h2>
        </li>
        <li>
        <h2 class="country__block">Languges: <span class="country__text">${Object.values(
          languages
        ).join(', ')}</span></h2>
      </li>
    </ul>`;
    }
  );

  refs.infoBox.insertAdjacentHTML('beforeend', markup.join(''));
}

/**
 * Function resets all HTML alements
 */
function clearRender() {
  refs.list.innerHTML = '';
  refs.infoBox.innerHTML = '';
}
