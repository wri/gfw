import * as THREE from 'three';

export function latLongToVector3(lat, lon, radius, heigth) {
  const phi = (lat) * (Math.PI / 180);
  const theta = (lon - 180) * (Math.PI / 180);

  const x = -(radius + heigth) * Math.cos(phi) * Math.cos(theta);
  const y = (radius + heigth) * Math.sin(phi);
  const z = (radius + heigth) * Math.cos(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
}

export function addStats() {
  const scriptElement = document.createElement('script');
  scriptElement.onload = function onLoad() {
    const stats = new Stats();
    document.body.appendChild(stats.dom);
    requestAnimationFrame(function loop() {
      stats.update();
      requestAnimationFrame(loop);
    });
  };
  scriptElement.src = '//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';
  document.head.appendChild(scriptElement);
}
