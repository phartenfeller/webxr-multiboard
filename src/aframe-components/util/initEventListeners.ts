import { addLevel, reset } from '../../store/boardStore';
import {
  BTN_COLOR,
  BTN_CLICK_COLOR,
  BTN_HOVER_COLOR,
} from '../../constants/buttonColors';
import { baseWait } from '../../constants';

function toggleHelpText(show: boolean, id: string) {
  const el = document.getElementById(`${id}-helptext`);
  el.setAttribute('visible', show ? 'ture' : 'false');
}

function setElColor(el: any, color: string) {
  const material = el.getAttribute('material');
  material.color = color;
  el.setAttribute('material', material);
}

export function initEventListeners(
  boardId: string,
  level: number,
  bubbleId: string
) {
  function mouseEnterHandler(e: Event) {
    const btn = e.target as any;
    setElColor(btn, BTN_HOVER_COLOR);
    toggleHelpText(true, btn.id);
  }

  function mouseLeaveHandler(e: Event) {
    const btn = e.target as any;
    setElColor(btn, BTN_COLOR);
    toggleHelpText(false, btn.id);
  }

  function clickHandler(e: Event) {
    const clickedBtn = e.currentTarget as HTMLElement;

    setTimeout(() => {
      document.querySelectorAll(domQuery).forEach((btn: HTMLElement) => {
        btn.removeEventListener('click', clickHandler);
        btn.removeEventListener('mouseenter', mouseEnterHandler);
        btn.removeEventListener('mouseleave', mouseLeaveHandler);
        btn.classList.remove('collidable');

        const color = btn.id !== clickedBtn.id ? BTN_CLICK_COLOR : BTN_COLOR;
        setElColor(btn, color);
      });
    }, baseWait);

    toggleHelpText(false, clickedBtn.id);

    const pos = clickedBtn.getAttribute('position') as any;
    clickedBtn.setAttribute('position', `${pos.x} ${pos.y} -0.018}`);

    const filter = parseInt(clickedBtn.dataset.filter);
    console.log('filter => ', filter);

    setTimeout(() => {
      addLevel(boardId, level, filter, bubbleId);
    }, baseWait * 2);
  }

  const domQuery = `a-box.vr-btn.board-${boardId}.level-${level}.bubble-${bubbleId}`;
  console.log(domQuery);

  document.querySelectorAll(domQuery).forEach((btn) => {
    btn.addEventListener('click', clickHandler);
    btn.addEventListener('mouseenter', mouseEnterHandler);
    btn.addEventListener('mouseleave', mouseLeaveHandler);
  });
}

export function initResetListener(boardId: string, el: HTMLElement) {
  el.addEventListener('click', () => {
    reset(boardId);
  });
  el.addEventListener('mouseenter', (e) =>
    setElColor(e.target, BTN_HOVER_COLOR)
  );
  el.addEventListener('mouseleave', (e) => setElColor(e.target, BTN_COLOR));
}
