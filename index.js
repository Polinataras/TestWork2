"use strict";
console.clear();

const costAB = 700;
const costBA = 1200;
const travelTimeMinutes = 50;

const timesAB = `
  2021-08-21 18:00:00
  2021-08-21 18:30:00
  2021-08-21 18:45:00
  2021-08-21 19:00:00
  2021-08-21 19:15:00
  2021-08-21 21:00:00
`;

const timesBA = `
  2021-08-21 18:30:00
  2021-08-21 18:45:00
  2021-08-21 19:00:00
  2021-08-21 19:15:00
  2021-08-21 19:35:00
  2021-08-21 21:50:00
  2021-08-21 21:55:00
`;

const parseTimes = times => times
  .trim()
  .split('\n')
  .map(str => new Date(str.trim()));

const datesAB = parseTimes(timesAB);
const datesBA = parseTimes(timesBA);

const el = Object.fromEntries(
  [ 'direction', 'timesAB', 'timesBA', 'blockAB', 'blockBA', 'output' ]
    .map(id => [id, document.getElementById(id)])
);

const oo = n => n.toString().padStart(2, '0');

const createOptions = (datesArray, id) => {
  datesArray.forEach(time => {
    const option = document.createElement('option');
    option.value = time.getTime();
    option.innerText = `${oo(time.getHours())}:${oo(time.getMinutes())}`;
    el[id].appendChild(option);
  });
};

createOptions(datesAB, 'timesAB');
createOptions(datesBA, 'timesBA');

const filterBAOptions = () => {
  let latest = 0; // no limits
  if (el.direction.value & 1) { // A->B active
    latest = +el.timesAB.value + travelTimeMinutes * 6e4;
  }
  const isSelectionValid = +el.timesBA.value >= latest;
  let isFixApplied = false;
  
  el.timesBA.querySelectorAll('option').forEach(opt => {
    if (+opt.value < latest) {
      opt.setAttribute('disabled', 'disabled');
    } else {
      opt.removeAttribute('disabled');
      if (!isSelectionValid && !isFixApplied) {
        el.timesBA.value = opt.value;
        isFixApplied = true;
      }
    }
  });
};

const onDirectionChange = () => {
  const bits = +el.direction.value;
  el.blockAB.classList[bits & 1 ? 'remove' : 'add']('hidden');
  el.blockBA.classList[bits & 2 ? 'remove' : 'add']('hidden');
};

const updateTimes = () => {
  const abTime = el.timesAB.value;
}; 

const printTicket = () => {
  // const route = 
  const cost = 1 * (((el.direction.value & 1) ? costAB : 0) + ((el.direction.value & 2) && costBA)); 
  el.output.innerHTML = `
<p>Общая стоимость билетов - ${cost} руб.</p>
<p>Это путешествие займет у вас 50 минут.</p>
<p>Теплоход отправляется в 18:00, а прибудет в 19:50</p>
  `;
};

const update = () => (onDirectionChange(), filterBAOptions(), printTicket());

el.direction.addEventListener('change', update);
el.timesAB.addEventListener('change', update);
el.timesBA.addEventListener('change', update);

update();