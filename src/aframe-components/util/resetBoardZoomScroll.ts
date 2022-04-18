export function resetBoardZoomScroll() {
  console.log('resetBoardZoomScroll');

  const boardEl = document.getElementById('b-mid') as any;
  let { x, y, z } = boardEl?.object3D?.position;
  x = 0;
  y = 0;
  boardEl.object3D.position.set(x, y, z);

  boardEl.object3D.scale.x = 1;
  boardEl.object3D.scale.y = 1;
}
