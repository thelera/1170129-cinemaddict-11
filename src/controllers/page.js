import {extraFilms, FilmsCount, RenderPosition, SortType} from "../utils/consts.js";
import {remove, render} from "../utils/render.js";
import ExtraFilmComponent from "../components/extra-films.js";
import FilmListComponent from "../components/films-list.js";
import MovieController from "./movie.js";
import NoFilmsComponent from "../components/no-films.js";
import ShowMoreButtonComponent from "../components/show-more-button.js";
import SortComponent from "../components/sort.js";
import FilmListContainerComponent from "../components/film-list-container.js";

export default class PageController {
  constructor(container, filmsModel, comments) {
    this._container = container;
    this._filmsModel = filmsModel;

    this._comments = comments;
    this._showedFilmsControllers = [];
    this._showedExtraFilmsControllers = [];

    this._showingFilmsCount = FilmsCount.SHOWING_FILMS_COUNT_ON_START;

    this._filmsListComponent = new FilmListComponent();
    this._filmsListContainerComponent = new FilmListContainerComponent();
    this._noFilmsComponent = new NoFilmsComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._sortComponent = new SortComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onLoadMoreButtonClick = this._onLoadMoreButtonClick.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._filmsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const films = this._filmsModel.getFilms();

    films.forEach((it, index) => (it.id = index));
    this._comments.forEach((it, index) => (it.id = index));

    // отрисуем сортировку
    const siteMainElement = document.querySelector(`.main`);
    render(siteMainElement, this._sortComponent);

    // отрисовываем фильмы
    render(siteMainElement, this._container);
    render(this._container.getElement(), this._filmsListComponent, RenderPosition.AFTERBEGIN);
    render(this._filmsListComponent.getElement(), this._filmsListContainerComponent);

    if (FilmsCount.FILMS_COUNT === 0) {
      render(this._filmsListComponent.getElement(), this._noFilmsComponent);
      return;
    }

    this._renderFilms(this._filmsListContainerComponent, films.slice(0, this._showingFilmsCount));
    this._renderShowMoreButton();
  }

  renderExtraFilms() {
    extraFilms.forEach((it) => {
      const extraFilmsListComponent = new ExtraFilmComponent(it.title);
      render(this._container.getElement(), extraFilmsListComponent);
      const filmListContainerComponent = new FilmListContainerComponent();
      render(extraFilmsListComponent.getElement(), filmListContainerComponent);

      const filmsToRender = this._getSortedFilms(this._filmsModel.getFilms(), it.sortType, 0, FilmsCount.EXTRA_FILMS_COUNT);
      
      this._renderFilms(filmListContainerComponent, filmsToRender);
    });
  }

  _renderFilms(container, films) {
    const newFilms = this._renderCards(container.getElement(), films);
    this._showedFilmsControllers = this._showedFilmsControllers.concat(newFilms);
  }

  _removeFilms() {
    this._showedFilmsControllers.forEach((filmController) => filmController.destroy());
    this._showedFilmsControllers = [];
  }

  _updateFilms (count) {
    this._removeFilms();

    this._renderFilms(this._filmsListContainerComponent, this._filmsModel.getFilms().slice(0, count));
    this._renderShowMoreButton();
  }

  _onSortTypeChange(sortType) {
    this._showingFilmsCount = FilmsCount.SHOWING_FILMS_COUNT_BY_BUTTON;
    const sortedFilms = this._getSortedFilms(this._filmsModel.getFilms(), sortType, 0, this._showingFilmsCount);

    this._removeFilms();

    this._renderFilms(this._filmsListContainerComponent, sortedFilms);
    this._renderShowMoreButton();
  }

  _onFilterChange() {
    this._updateFilms(FilmsCount.SHOWING_FILMS_COUNT_ON_START);
  }

  _renderShowMoreButton() {
    remove(this._showMoreButtonComponent);
    this._showingFilmsCount = FilmsCount.SHOWING_FILMS_COUNT_ON_START;

    if (this._filmsModel.getFilms().length <= FilmsCount.SHOWING_FILMS_COUNT_ON_START) {
      return;
    }

    render(this._filmsListComponent.getElement(), this._showMoreButtonComponent);

    this._showMoreButtonComponent.setClickHandler(this._onLoadMoreButtonClick);
  }

  _onLoadMoreButtonClick() {
    let previousFilmsCount = this._showingFilmsCount;
    this._showingFilmsCount = previousFilmsCount + FilmsCount.SHOWING_FILMS_COUNT_BY_BUTTON;

    const sortedFilms = this._getSortedFilms(this._filmsModel.getFilms(), this._sortComponent.getSortType(), previousFilmsCount, this._showingFilmsCount);

    const newFilms = this._renderCards(this._filmsListContainerComponent.getElement(), sortedFilms);
    this._showedFilmsControllers = this._showedFilmsControllers.concat(newFilms);

    previousFilmsCount += FilmsCount.SHOWING_FILMS_COUNT_BY_BUTTON;
    if (previousFilmsCount >= this._filmsModel.getFilms().length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderCards(container, films) {
    return films.map((film) => {
      const filmController = new MovieController(container, this._onDataChange, this._onViewChange);
      const commentsOfFilm = this._comments.find((comment) => film.id === comment.id);
      filmController.render(film, commentsOfFilm);

      return filmController;
    });
  }

  _onDataChange(oldCard, newCard) {
    const isSuccess = this._filmsModel.updateFilm(oldCard.id, newCard);

    if (isSuccess) {
      const oldFilmController = this._showedFilmsControllers.find((it) => it.card === oldCard);
      const oldExtraFilmController = this._showedExtraFilmsControllers.find((it) => it.card === oldCard);

      const commentsOfFilm = this._comments.find((comment) => newCard.id === comment.id);

      if (oldFilmController) {
        oldFilmController.render(newCard, commentsOfFilm);
      }

      if (oldExtraFilmController) {
        oldExtraFilmController.render(newCard, commentsOfFilm);
      }
    }
  }

  _onViewChange() {
    this._showedFilmsControllers.forEach((it) => it.setDefaultView());
    this._showedExtraFilmsControllers.forEach((it) => it.setDefaultView());
  }

  _getSortedFilms(films, sortType, from, to) {
    let sortedFilms = [];
    const filmsToSort = [...films];

    switch (sortType) {
      case SortType.DEFAULT:
        sortedFilms = filmsToSort;
        break;
      case SortType.BY_RATING:
        sortedFilms = filmsToSort.sort((a, b) => b.rating - a.rating);
        break;
      case SortType.BY_COMMENTS:
        const commentsToSort = [...this._comments];
        const sortedComments = commentsToSort.sort((a, b) => b.length - a.length);
        sortedFilms = sortedComments.map((comment) => {
          return filmsToSort.find((film) => film.id === comment.id);
        });
        break;
      case SortType.BY_DATE:
        sortedFilms = filmsToSort.sort((a, b) => b.releaseDate - a.releaseDate);
        break;
    }

    return sortedFilms.slice(from, to);
  }
}
