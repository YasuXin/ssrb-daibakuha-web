const bodyEl = document.body;

const createCursor = () => {
  const el = document.createElement('img');
  el.src = 'images/cursor.png';
  el.id = 'cursor';
  el.style.display = 'none'
  bodyEl.appendChild(el);
}

const createExplosion = () => {
  const el = document.createElement('img');
  el.src = 'images/explosion.gif';
  el.id = 'explosion';
  el.style.display = 'none'
  bodyEl.appendChild(el);
}

const createSsrb0 = () => {
  const el0 = document.createElement('img');
  el0.src = 'images/ssrb-0-0.png';
  el0.id = 'ssrb-0-0';
  el0.style.display = 'none'
  bodyEl.appendChild(el0);

  const el10 = document.createElement('img');
  el10.src = 'images/ssrb-0-10.png';
  el10.id = 'ssrb-0-10';
  el10.style.display = 'none'
  bodyEl.appendChild(el10);
}

const createSsrb = (ssrbNum) => {
  for (let i = 0; i < 20; i++) {
    const el = document.createElement('img');
    el.src = 'images/ssrb-' + ssrbNum + '-' + i + '.png';
    el.id = 'ssrb-' + ssrbNum + '-' + i;
    el.style.display = 'none'
    bodyEl.appendChild(el);
  }
}

const createSsrb100 = () => {
  const el0 = document.createElement('img');
  el0.src = 'images/ssrb100.png';
  el0.id = 'ssrb100';
  el0.style.display = 'none'
  bodyEl.appendChild(el0);
}

const createSsrb101 = () => {
  const el0 = document.createElement('img');
  el0.src = 'images/ssrb-101-0.png';
  el0.id = 'ssrb-101-0';
  el0.style.display = 'none'
  bodyEl.appendChild(el0);

  const el10 = document.createElement('img');
  el10.src = 'images/ssrb-101-10.png';
  el10.id = 'ssrb-101-10';
  el10.style.display = 'none'
  bodyEl.appendChild(el10);
}

const createSsrbtn = () => {
  for (let i = 0; i < 13; i++) {
    const el = document.createElement('img');
    el.src = 'images/ssrbtn' + i + '.png';
    el.id = 'ssrb' + i;
    el.style.display = 'none'
    bodyEl.appendChild(el);
  }
}

createCursor()
createExplosion()
createSsrb0()
createSsrb(1)
createSsrb(2)
createSsrb(3)
createSsrb(4)
createSsrb(5)
createSsrb100()
createSsrb101()
createSsrbtn()
