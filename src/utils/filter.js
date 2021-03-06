import {FilmControl, FilterType} from "../utils/consts.js";

const getFilterByProperty = (array, property) => array.filter((item) => item.controls[property]);

const getFilmsByFilter = (films, filterType) => {
  switch (filterType) {
    case FilterType.ALL:
      return films;
    case FilterType.WATCHLIST:
      return getFilterByProperty(films, FilmControl.WATCHLIST);
    case FilterType.HISTORY:
      return getFilterByProperty(films, FilmControl.WATCH);
    case FilterType.FAVOURITES:
      return getFilterByProperty(films, FilmControl.FAVOURITE);
  }

  return films;
};

export {getFilterByProperty, getFilmsByFilter};
