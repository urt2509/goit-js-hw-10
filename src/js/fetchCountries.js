export function fetchCountries(name) {
  const URL = `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`;

  return fetch(URL).then(resp => {
    if (!resp.ok) {
      throw new Error(resp.status);
    }

    return resp.json();
  });
}
