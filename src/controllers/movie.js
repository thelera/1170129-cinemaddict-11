import DetailsPopupComponent from "../components/details-popup.js";
import FilmCardComponent from "../components/card.js";
import {ESC_BUTTON} from "../utils/consts.js";
import {render, remove, replace} from "../utils/render.js";

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._cardComponent = null;
    this._popupComponent = null;
    this.card = null;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  render(card, comments) {
    this.card = card;
    const oldCardComponent = this._cardComponent;
    const oldPopupComponent = this._popupComponent;

    this._cardComponent = new FilmCardComponent(this.card, comments);
    this._popupComponent = new DetailsPopupComponent(this.card, comments);

    const siteBodyElement = document.querySelector(`body`);

    const closeButtonClickHandler = () => {
      remove(this._popupComponent);
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    };

    // отрисуем карточку фильма
    if (oldCardComponent && oldPopupComponent) {
      replace(this._cardComponent, oldCardComponent);
      replace(this._popupComponent, oldPopupComponent);

      this._popupComponent.setCloseButtonClickHandler(closeButtonClickHandler);
      this._subscribePopupOnEvents();
    } else {
      render(this._container, this._cardComponent);
    }

    const cardClickHandler = () => {
      this._onViewChange();
      render(siteBodyElement, this._popupComponent);

      this._subscribePopupOnEvents();
      this._popupComponent.subscribeOnEvents();
      this._popupComponent.setCloseButtonClickHandler(closeButtonClickHandler);
      document.addEventListener(`keydown`, this._escKeyDownHandler);
    };

    // показ попапа с подробной информацией о фильме
    this._cardComponent.setClickHandler(cardClickHandler);

    // кнопки watchlist, watched, favourite
    this._subscribeCardControlsOnEvents();
  }

  setDefaultView() {
    remove(this._popupComponent);
  }

  destroy() {
    remove(this._cardComponent);
    remove(this._popupComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === ESC_BUTTON) {
      remove(this._popupComponent);
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    }
  };

  _subscribePopupOnEvents() {
    this._popupComponent.setAddToWatchlistClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this.card, Object.assign({}, this.card, {isAddedToWatchlist: !this.card.isAddedToWatchlist}));
    });
    this._popupComponent.setMarkAsWatchedClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this.card, Object.assign({}, this.card, {isWatched: !this.card.isWatched}));
    });
    this._popupComponent.setAddToFavouritesClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this.card, Object.assign({}, this.card, {isFavourite: !this.card.isFavourite}));
    });
  }

  _subscribeCardControlsOnEvents() {
    this._cardComponent.setAddToWatchlistClickHandler(() => {
      this._onDataChange(this.card, Object.assign({}, this.card, { isAddedToWatchlist: !this.card.isAddedToWatchlist }));
    });

    this._cardComponent.setMarkAsWatchedClickHandler(() => {
      this._onDataChange(this.card, Object.assign({}, this.card, { isWatched: !this.card.isWatched }));
    });

    this._cardComponent.setAddToFavouritesClickHandler(() => {
      this._onDataChange(this.card, Object.assign({}, this.card, { isFavourite: !this.card.isFavourite }));
    });
  }
}
