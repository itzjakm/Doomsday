function leftPad(number, targetLength) {
  var output = number + '';
  while (output.length < targetLength) {
    output = '0' + output;
  }
  return output;
}
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const dayNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
let timerDate;
function randomNum(MIN_NUMBER, MAX_NUMBER) {
  return Math.floor(Math.random() * MAX_NUMBER) + MIN_NUMBER;
}
const maxYear = 3000;
function getRandomDate() {
  const date = new Date(
    randomNum(0, maxYear),
    randomNum(0, 11),
    randomNum(0, 31)
  );
  return date;
}
function eraseClasses() {
  [...document.querySelectorAll('button')].forEach(button => {
    button.classList.remove('button-correct');
    button.classList.remove('button-incorrect');
    button.classList.remove('button-highlight');
    button.classList.remove('button-doomsday');
  });
}

function displayDate() {
  eraseClasses();
  date = getRandomDate();
  const string = `${date.getDate()}/${
    monthNames[date.getMonth()]
  }/${date.getFullYear()}`;
  timerDate = new Date();
  document.querySelector('h2').classList.add('hide');
  document.querySelector('h1').textContent = string;
  console.log(date.getDay());
}
displayDate();
document.querySelector('.buttons').addEventListener('click', e => {
  const button = e.target.closest('button');
  if (!button) return;

  const el = document.querySelector('h1');
  [...document.querySelectorAll('button')]
    .find(
      e =>
        e.innerText ===
        dayNames[new Date(+el.textContent.split('/')[2], 3, 4).getDay()]
    )
    .classList.add('button-doomsday');

  const correctDay = new Date(el.textContent).getDay();
  const result = correctDay === dayNames.indexOf(button.innerText);
  if (result) button.classList.add('button-correct');
  else {
    button.classList.add('button-incorrect');
    [...document.querySelectorAll('button')]
      .find(e => e.innerText === dayNames[correctDay])
      .classList.add('button-highlight');
  }

  button.blur();

  if (timerDate) {
    const newDate = new Date();
    const preSec = Math.ceil((newDate - timerDate) / 1000);
    const seconds = leftPad(preSec % 60, 2);
    const minutes = leftPad(Math.floor(preSec / 60), 2);
    const el = document.querySelector('h2');
    el.textContent = `${minutes}:${seconds}`;
    el.classList.remove('hide');
  }
});
function reset(keyboard) {
  return e => {
    if (keyboard) if (e.key !== ' ') return;
    displayDate();
  };
}
document.addEventListener('keydown', reset(true));
document.querySelector('.container').addEventListener('dblclick', reset(false));
//Service Worker
if ('serviceWorker' in navigator) {
  // Use the window load event to keep the page load performant
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js');
  });
}
