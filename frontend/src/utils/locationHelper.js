import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import { Country, State } from "country-state-city";

countries.registerLocale(enLocale);

export function getFullLocation(city, stateCode, countryCode) {
  let parts = [];

  if (city) parts.push(city);

  if (stateCode && countryCode) {
    const state = State.getStateByCodeAndCountry(stateCode, countryCode);
    if (state) {
      parts.push(state.name);
    } else {
      parts.push(stateCode);
    }
  }

  if (countryCode) {
    const country = Country.getCountryByCode(countryCode);
    if (country) {
      parts.push(country.name);
    } else {
      const fallback = countries.getName(countryCode, "en");
      if (fallback) parts.push(fallback);
    }
  }

  return parts.join(", ");
}
