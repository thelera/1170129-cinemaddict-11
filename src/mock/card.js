import {getRandomDate, getRandomIntegerNumber, getRandomFloatNumber, getRandomArrayItem, getSeveralRandomArrayItems} from "../utils.js";

const filmsData = {
  actors: {
    quantity: 3,
    names: [
      `Jack Nicholson`,
      `Marlon Brando`,
      `Robert De Niro`,
      `Al Pacino`,
      `Daniel Day-Lewis`,
      `Dustin Hoffman`,
      `Tom Hanks`,
      `Anthony Hopkins`,
      `Paul Newman`,
      `Denzel Washington`,
      `Spencer Tracy`,
      `Laurence Olivier`,
      `Jack Lemmon`,
      `Michael Caine`,
      `James Stewart`,
      `Robin Williams`,
      `Robert Duvall`,
    ],
  },
  controls: [
    `watchlist`,
    `watched`,
    `favorite`,
  ],
  countries: [
    `Argentina`,
    `Australia`,
    `Austria`,
    `Belarus`,
    `Belgium`,
    `Bolivia`,
    `Brazil`,
    `Bulgaria`,
    `Cambodia`,
    `Canada`,
    `Chile`,
    `China`,
    `Colombia`,
    `Cuba`,
    `Czech Republic`,
    `Ethiopia`,
    `Finland`,
    `France`,
    `Georgia`,
    `Germany`,
    `Guatemala`,
    `Hong Kong`,
    `Hungary`,
    `India`,
    `Indonesia`,
    `Iran`,
    `Israel`,
    `Italy`,
    `Japan`,
    `North Korea`,
    `South Korea`,
    `Mexico`,
    `Netherlands`,
    `New Zealand`,
    `Norway`,
    `Peru`,
    `Portugal`,
    `Russia`,
    `Spain`,
    `Sweden`,
    `Switzerland`,
    `Thailand`,
    `Turkey`,
    `Ukraine`,
    `United Kingdom`,
    `United States`,
    `Vietnam`,
  ],
  description: {
    string: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`,
    maxLength: 140,
    sentencesCount: 5
  },
  directors: [
    `Woody Allen`,
    `Robert Altman`,
    `Ingmar Bergman`,
    `Mel Brooks`,
    `Tim Burton`,
    `James Cameron`,
    `Frank Capra`,
    `John Cassavetes`,
    `Charlie Chaplin`,
    `Coen, Joel and Ethan`,
    `Francis Ford Coppola`,
    `George Cukor`,
    `Michael Curtiz`,
  ],
  durationInMinutes: {
    min: 30,
    max: 180
  },
  genres: {
    quantity: 3,
    list: [
      `Musical`,
      `Western`,
      `Drama`,
      `Comedy`,
      `Cartoon`,
      `Mistery`,
    ],
  },
  maxFilmRating: 10,
  names: [
    `The Dance of Life`,
    `Sagebrush Trail`,
    `The Man with the Golden Arm`,
    `Santa Claus Conquers the Martians`,
    `Popeye the Sailor Meets Sindbad the Sailor`,
  ],
  posters: [
    `./images/posters/made-for-each-other.png`,
    `./images/posters/popeye-meets-sinbad.png`,
    `./images/posters/sagebrush-trail.jpg`,
    `./images/posters/santa-claus-conquers-the-martians.jpg`,
    `./images/posters/the-dance-of-life.jpg`,
    `./images/posters/the-great-flamarion.jpg`,
    `./images/posters/the-man-with-the-golden-arm.jpg`,
  ],
  writers: {
    quantity: 3,
    names: [
      `Billy Wilder`,
      `Ethan Coen and Joel Coen`,
      `Robert Towne`,
      `Quentin Tarantino`,
      `Francis Ford Coppola`,
      `William Goldman`,
      `Charlie Kaufman`,
      `Woody Allen`,
      `Nora Ephron`,
      `Ernest Lehman`,
      `Paul Schrader`,
      `Oliver Stone`,
      `Aaron Sorkin`,
      `Paddy Chayefsky`,
    ],
  },
};

export const GENRES = filmsData.genres.list;

const fromMinutesToHours = (timeInMinutes) => {
  const hours = Math.floor(timeInMinutes / 60);
  const minutes = timeInMinutes % 60;

  let time = `${hours}h ${minutes}m`;
  if (hours === 0) {
    time = `${minutes}m`;
  }
  if (minutes === 0) {
    time = `${hours * 60}m`;
  }

  return time;
};

const getFilmDescriptionFromString = (string, sentencesCount) => {
  const arrayOfStrings = string.split(`. `).map((it) => it.concat(`.`));
  let description = ``;
  while (sentencesCount > 0) {
    description += `${getRandomArrayItem(arrayOfStrings)} `;
    sentencesCount--;
  }

  return description;
};

const generateControls = () => {
  const randomIndex = getRandomIntegerNumber(0, filmsData.controls.length);
  const controls = filmsData.controls.map((it, i) => ({name: it, isActive: i === randomIndex}));
  return controls;
};

export const generateCard = () => {
  return {
    actors: getSeveralRandomArrayItems(filmsData.actors.quantity, filmsData.actors.names),
    age: getRandomIntegerNumber(0, 18),
    commentsCount: getRandomIntegerNumber(0, 100),
    controls: generateControls(),
    country: getRandomArrayItem(filmsData.countries),
    description: getFilmDescriptionFromString(filmsData.description.string, filmsData.description.sentencesCount),
    director: getRandomArrayItem(filmsData.directors),
    duration: fromMinutesToHours(getRandomIntegerNumber(filmsData.durationInMinutes.min, filmsData.durationInMinutes.max)),
    genres: getSeveralRandomArrayItems(filmsData.genres.quantity, filmsData.genres.list),
    image: getRandomArrayItem(filmsData.posters),
    title: getRandomArrayItem(filmsData.names),
    rating: getRandomFloatNumber(filmsData.maxFilmRating),
    releaseDate: getRandomDate(),
    writers: getSeveralRandomArrayItems(filmsData.writers.quantity, filmsData.writers.names),
  };
};

export const generateCards = (count) => {
  return new Array(count).fill(``).map(() => generateCard());
};