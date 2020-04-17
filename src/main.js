import {ESC_BUTTON, COMMENTS_TO_SHOW,FILMS_COUNT, EXTRA_FILMS_COUNT, SHOWING_FILMS_COUNT_ON_START, SHOWING_FILMS_COUNT_BY_BUTTON, RenderPosition} from "./consts.js";
import {render, getRandomIntegerNumber} from "./utils.js";
import {generateCards} from "./mock/card.js";
import {createFilters} from "./mock/filter.js";
import {generateComments} from "./mock/comment.js";
import FilmCardComponent from "./components/card.js";
import ExtraFilmComponent from "./components/extra-films.js";
import MainFilmListComponent from "./components/films-list.js";
import AllFilmsComponent from "./components/films.js";
import NavigationComponent from "./components/navigation.js";
import FilterComponent from "./components/filter.js";
import RatingComponent from "./components/rating.js";
import ShowMoreButtonComponent from "./components/show-more-button.js";
import StatisticsComponent from "./components/statistics.js";
import SortingComponent from "./components/sorting.js";
import DetailsPopupComponent from "./components/details-popup.js";
import CommentsComponent from "./components/comment.js";
import NoFilmsComponent from "./components/no-films.js";

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);

const showComments = (container, comments) => {
  const commentsToShow = COMMENTS_TO_SHOW <= comments.length ? COMMENTS_TO_SHOW : comments.length;
  for (let i = 0; i < commentsToShow; i++) {
    render(container, new CommentsComponent(comments[i]).getElement());
  }
};

const renderCard = (filmsListContainerElement, card) => {
  const comments = generateComments();

  const cardComponent = new FilmCardComponent(card, comments.length);
  const popupComponent = new DetailsPopupComponent(card, comments.length);

  const commentsList = popupComponent.getElement().querySelector(`.film-details__comments-list`);
  showComments(commentsList, comments);

  const siteBodyElement = document.querySelector(`body`);
  const cardImage = cardComponent.getElement().querySelector(`.film-card__poster`);
  const cardTitle = cardComponent.getElement().querySelector(`.film-card__title`);
  const cardComments = cardComponent.getElement().querySelector(`.film-card__comments`);

  const onEscKeyDown = (evt) => {
    if (evt.key === ESC_BUTTON) {
      popupComponent.getElement().remove();
      popupComponent.removeElement();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const onPopupCloseButtonClick = () => {
    popupComponent.getElement().remove();
    popupComponent.removeElement();
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const onCardClick = () => {
    render(siteBodyElement, popupComponent.getElement());

    const popupCloseButton = popupComponent.getElement().querySelector(`.film-details__close-btn`);

    popupCloseButton.addEventListener(`click`, onPopupCloseButtonClick);
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  render(filmsListContainerElement, cardComponent.getElement());
  
  cardImage.addEventListener(`click`, onCardClick);
  cardTitle.addEventListener(`click`, onCardClick);
  cardComments.addEventListener(`click`, onCardClick);
};

const renderFilms = (filmsContainerElement, films) => {
  const filmsListElement = new MainFilmListComponent().getElement();
  render(siteMainElement, filmsContainerElement);
  render(filmsContainerElement, filmsListElement);

  if (FILMS_COUNT === 0) {
    render(filmsListElement, new NoFilmsComponent().getElement());
    return;
  }

  const filmsListContainerElement = filmsListElement.querySelector(`.films-list__container`);

  const showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
  films.slice(0, showingFilmsCount).forEach((it) => renderCard(filmsListContainerElement, it));

  const showMoreButtonComponent = new ShowMoreButtonComponent();
  render(filmsListElement, showMoreButtonComponent.getElement());

  let previousFilmsCount = showingFilmsCount;
  showMoreButtonComponent.getElement().addEventListener(`click`, () => {
    films.slice(previousFilmsCount, previousFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON).forEach((it) => renderCard(filmsListContainerElement, it));
    previousFilmsCount += SHOWING_FILMS_COUNT_BY_BUTTON;
    if (previousFilmsCount >= films.length) {
      showMoreButtonComponent.getElement().remove();
      showMoreButtonComponent.getElement().removeElement();
    }
  });

  const extraFilms = ['Top rated', 'Most commented'];
  extraFilms.forEach(title => {
    render(filmsContainerElement, new ExtraFilmComponent(title).getElement());

    const extraFilmListTitleElements = filmsContainerElement.querySelectorAll(`.films-list__title`);
    for (const element of extraFilmListTitleElements) {
      if (element.textContent === title) {
        const container = element.nextElementSibling;
        for (let i = 0; i < EXTRA_FILMS_COUNT; i++) {
          renderCard(container, films[i]);
        }
      }
    }
  });
};

// отрисовываем звание пользователя
render(siteHeaderElement, new RatingComponent().getElement());

// отрисовываем навигацию (фильтры и статистику)
const filters = createFilters();
const navigationElement = new NavigationComponent().getElement();
render(siteMainElement, navigationElement);
render(navigationElement, new FilterComponent(filters).getElement(), RenderPosition.AFTEREEND);

// отрисовываем сортировку
render(siteMainElement, new SortingComponent().getElement());

// отрисовываем фильмы
const films = generateCards(FILMS_COUNT);
const filmsContainerElement = new AllFilmsComponent().getElement();
renderFilms(filmsContainerElement, films);

//отрисовываем страницу со статистикой
render(siteMainElement, new StatisticsComponent().getElement());
