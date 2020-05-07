import AllFilmsComponent from "./components/films.js";
import API from "./api.js";
import CommentsModel from "./models/comments.js";
import FilmsModel from "./models/movies.js";
import FilterController from "./controllers/filter.js";
import NavigationComponent from "./components/navigation.js";
import PageController from "./controllers/page.js";
import RatingComponent from "./components/rating.js";
import StatisticsComponent from "./components/statistics.js";
import {render} from "./utils/render.js";
import {MenuItem} from "./utils/consts.js";

const AUTHORIZATION = `Basic dXNlchjuhuyi===kBwYXNzd29yZAo=`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);

const api = new API(AUTHORIZATION, END_POINT);
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();

const navigationComponent = new NavigationComponent();
const filmsContainerComponent = new AllFilmsComponent();
const statisticsComponent = new StatisticsComponent();

const filtersController = new FilterController(navigationComponent, filmsModel);
const pageController = new PageController(filmsContainerComponent, filmsModel, commentsModel, api);

render(siteMainElement, navigationComponent);
render(siteMainElement, statisticsComponent);
statisticsComponent.hide();

navigationComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.FILTERS:
      statisticsComponent.hide();
      pageController.show();
      break;
    case MenuItem.STATISTICS:
      statisticsComponent.show();
      pageController.hide();
      break;
  }
});

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(films);
    return films.map((film) => api.getComments(film.id));
  })
  .then((allComments) => Promise.all(allComments))
  .then((comments) => {
    commentsModel.setComments(comments);

    const watchedFilmsCount = filmsModel.getFilms().reduce((filmsCount, film) => film.isWatched ? filmsCount += 1 : filmsCount, 0);

    render(siteHeaderElement, new RatingComponent(watchedFilmsCount));
    pageController.render();
    pageController.renderExtraFilms();
    filtersController.render();
  });
