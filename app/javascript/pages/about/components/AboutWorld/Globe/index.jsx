import React from 'react';
import * as THREE from 'three';
import orbitControl from 'three-orbit-controls';
import customData from './assets/data.json';
import earthImage from './images/earth-image.jpg';
import earthBumpImage from './images/earth-bump.jpg';
import { latLongToVector3 } from './utils';

const Control = orbitControl(THREE);

class GlobeComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      scrollTop: props.scrollTop,
      markers: false,
      modalImage: null,
      modalText: null,
      modalTitle: null
    };
  }

  componentDidMount() {
    this.state = {
      scrollTop: this.props.scrollTop,
      markers: false,
      texture: false
    };

    const width = this.props.width;
    const height = this.props.height;

    const fov = 36;
    const near = 1;
    const far = 1500;

    this.scene = new THREE.Scene();
    this.imageLoader = new THREE.TextureLoader();
    this.camera = new THREE.PerspectiveCamera(fov, width / height, near, far);
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    this.camera.position.z = (far / 2) * 0.90;
    this.renderer.setSize(width, height);

    this.el.appendChild(this.renderer.domElement);

    this.addControls();
    this.addLights();
    this.addGlobe();
    this.addMarkers();

    this.scene.add(this.camera);

    this.draw();

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    this.el.addEventListener('click', function(event) {
      event.preventDefault();

      mouse.x = (event.offsetX / this.renderer.domElement.clientWidth) * 2 - 1;
      mouse.y = - (event.offsetY / this.renderer.domElement.clientHeight) * 2 + 1;

      this.camera.updateMatrixWorld();
      raycaster.setFromCamera( mouse, this.camera );

      const intersects = raycaster.intersectObjects( this.scene.children );

      if (intersects && intersects.length > 1) {
        const userData = intersects[0].object.data;
        this.showmodal(userData.Places, userData.Description, userData.ID);
      }
    }.bind(this), false);
  }

  addControls() {
    this.control = new Control(this.camera, this.renderer.domElement);
    this.control.enableDamping = false;
    this.control.dampingFactor = 0;
    this.control.autoRotate = this.props.autorotate;
    this.control.enablePan = false;
    this.control.enableZoom = false;
    this.control.rotateSpeed = 0.1;
    this.control.autoRotateSpeed = this.props.velocity;
  }

  addLights() {
    const ambientLight = new THREE.AmbientLight(0x364047);
    this.directionalLight = new THREE.DirectionalLight(0x9aaab8, 1);
    this.directionalLight.position.set(this.props.width, this.props.height * 0.7, 0);
    this.scene.add(ambientLight);
    this.camera.add(this.directionalLight);
  }

  addGlobe() {
    const material = new THREE.MeshPhongMaterial({
      map: this.imageLoader.load(this.props.earthImage),
      bumpMap: this.imageLoader.load(this.props.earthBumpImage),
      bumpScale: 4
    });
    const geometry = new THREE.SphereGeometry(this.props.radius, 40, 30);
    const earth = new THREE.Mesh(geometry, material);
    earth.updateMatrix();
    this.earth = earth;
    this.scene.add(earth);
  }

  showmodal(title, description, id) {
    alert('modal!');
  }

  /**
   * Rotate globe to given angle in X axis
   * @param  {Number} angle
   */
  rotateX(angle) {
    this.control.customRotate(angle);
  }

  /**
   * Method to add markers on globe
   */
  addMarkers() {
    const texture = THREE.ImageUtils.loadTexture('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNDVweCIgaGVpZ2h0PSI0NHB4IiB2aWV3Qm94PSIwIDAgNDUgNDQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDQ2LjEgKDQ0NDYzKSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5GaWxsIDE8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZGVmcz4KICAgICAgICA8ZmlsdGVyIHg9Ii0zMi44JSIgeT0iLTIzLjQlIiB3aWR0aD0iMTY1LjYlIiBoZWlnaHQ9IjE2OC44JSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94IiBpZD0iZmlsdGVyLTEiPgogICAgICAgICAgICA8ZmVPZmZzZXQgZHg9IjAiIGR5PSIzIiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93T2Zmc2V0T3V0ZXIxIj48L2ZlT2Zmc2V0PgogICAgICAgICAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIzIiBpbj0ic2hhZG93T2Zmc2V0T3V0ZXIxIiByZXN1bHQ9InNoYWRvd0JsdXJPdXRlcjEiPjwvZmVHYXVzc2lhbkJsdXI+CiAgICAgICAgICAgIDxmZUNvbG9yTWF0cml4IHZhbHVlcz0iMCAwIDAgMCAwICAgMCAwIDAgMCAwICAgMCAwIDAgMCAwICAwIDAgMCAwLjIgMCIgdHlwZT0ibWF0cml4IiBpbj0ic2hhZG93Qmx1ck91dGVyMSIgcmVzdWx0PSJzaGFkb3dNYXRyaXhPdXRlcjEiPjwvZmVDb2xvck1hdHJpeD4KICAgICAgICAgICAgPGZlTWVyZ2U+CiAgICAgICAgICAgICAgICA8ZmVNZXJnZU5vZGUgaW49InNoYWRvd01hdHJpeE91dGVyMSI+PC9mZU1lcmdlTm9kZT4KICAgICAgICAgICAgICAgIDxmZU1lcmdlTm9kZSBpbj0iU291cmNlR3JhcGhpYyI+PC9mZU1lcmdlTm9kZT4KICAgICAgICAgICAgPC9mZU1lcmdlPgogICAgICAgIDwvZmlsdGVyPgogICAgICAgIDxlbGxpcHNlIGlkPSJwYXRoLTIiIGN4PSIxNS44MzQ1NTQ0IiBjeT0iMTYiIHJ4PSIxNS44MzQ1NTQ0IiByeT0iMTYiPjwvZWxsaXBzZT4KICAgICAgICA8ZWxsaXBzZSBpZD0icGF0aC00IiBjeD0iMTUuODM0NTU0NCIgY3k9IjE2IiByeD0iMTUuODM0NTU0NCIgcnk9IjE2Ij48L2VsbGlwc2U+CiAgICA8L2RlZnM+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iTmV3LUFib3V0IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMzc1LjAwMDAwMCwgLTU2OS4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9Ildoby11c2VzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMjkuMDAwMDAwLCA0NjQuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iZWFydGgiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDAwMDAwLCAyNi4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iRmlsbC0xIiBmaWx0ZXI9InVybCgjZmlsdGVyLTEpIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNTIuNTcyMDE2LCA4MS44NDcwMjUpIj4KICAgICAgICAgICAgICAgICAgICAgICAgPG1hc2sgaWQ9Im1hc2stMyIgZmlsbD0id2hpdGUiPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPSIjcGF0aC0yIj48L3VzZT4KICAgICAgICAgICAgICAgICAgICAgICAgPC9tYXNrPgogICAgICAgICAgICAgICAgICAgICAgICA8dXNlIGlkPSJNYXNrIiBmaWxsPSIjRkZGRkZGIiB4bGluazpocmVmPSIjcGF0aC0yIj48L3VzZT4KICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTMwLjU3MDEyMDksMjUuNzAzMjc3NiBDMjkuODc4MTQ3MiwyMy4zNTE1MjQ0IDI2Ljg3NDIyNTcsMjIuMDMyNDU4MiAyNS43NzMzODY2LDIyLjA5NTgzNzIgQzI0LjY3MjM5MjcsMjIuMTU5NTI5MiAyMC44NTIyODkxLDIwLjk2NzY5MDUgMjAuODUyMjg5MSwyMC45Njc2OTA1IEwyMC4zOTYxODc0LDIwLjIyMDkxMzUgQzIwLjM5NjE4NzQsMjAuMjIwOTEzNSAyMC41ODQ5Nzc5LDE2LjU2NTg5OTcgMjAuNjQ4MDExMywxNS43ODc1MTE0IEMyMC43MTA3MzUsMTUuMDA4NjUzNiAyMC44NjgwODYyLDE0Ljc3MDQ3MzYgMjAuODY4MDg2MiwxNC43NzA0NzM2IEMyMC44NjgwODYyLDE0Ljc3MDQ3MzYgMjAuOTc4MDQ2MiwxNC44NjU2MjA0IDIxLjEzNTM5NzQsMTQuODY1NjIwNCBDMjEuMjkyNzQ4NywxNC44NjU2MjA0IDIxLjQ3OTIxNjEsMTQuNjM1ODkxIDIxLjUxNzkzNDQsMTQuMTUyNDg5IEMyMS41Njg0MjMxLDEzLjUyMjYxMSAyMS40NjE0MDU2LDEyLjY5NTI0MDggMjEuNDYxNDA1NiwxMi44MDM1MzI5IEMyMS40NjE0MDU2LDEyLjI1MDk2MTcgMjEuNzAyMjMzNSwxMi4wMjkyMTMzIDIxLjU3NjMyMTYsMTEuNzExMzc5MiBDMjEuNTAyMTM3MywxMS41MjM5MDI1IDIxLjM0MDc1OTQsMTEuNTIyMDI0NiAyMS4yMjAyNjgsMTEuNTUxNDQ1IEMyMS4yODg0MTIyLDExLjI4OTAwODkgMjEuMzQyMzA4MSwxMS4wNTg0OTcgMjEuMzU1NjI3MiwxMC45NTY0NjQ2IEMyMS40MDI3MDg3LDEwLjU5MTA1NzEgMjEuNDgxMzg0Myw5LjM5OTIxODQ0IDIxLjM1NTYyNzIsOC43NzkzNTU5IEMyMS4yMjk3MTUzLDguMTU5ODA2MzUgMjAuNDEyMTM5NCw2LjM4MDAyOTM3IDIwLjA4MTc5NDcsNS43OTE5MzQ2IEMxOS43NTE2MDUsNS4yMDM5OTYzMiAxOC45NTUwOTE4LDUuMjUwOTQzNzQgMTkuNjI1NjkzLDUuMjk5Mjk5NTkgQzE5Ljg0NTc2NzksNS4zMTUyNjE3MiAxOC44NjYwMzk3LDQuNzg4OTgxMDYgMTkuMDkwOTE1Nyw0Ljc3NTA1MzMyIEMxOS4zNDI1ODQ3LDQuNzU4Nzc4MjEgMTguNzI5Mjg2Niw0LjUzNjQwMzkgMTguNzI5Mjg2Niw0LjUzNjQwMzkgQzE4LjcyOTI4NjYsNC41MzY0MDM5IDE4Ljc5MjAxMDMsNC4wNTk1NzQ1MiAxOC42MzQ4MTQsNC4xMDc0NjA5IEMxOC40MzY4ODYsNC4xNjc1NTM2MSAxOC4yNTczODc5LDMuNjk0MTY3MDUgMTguMDA1ODczNywzLjk2NDQyNzc0IEMxNy43NTQyMDQ3LDQuMjM0NTMxOTQgMTcuODQ4NTIyNSwzLjMxMjc5NzQ0IDE3LjcwNjk2ODMsMy41ODMwNTgxMyBDMTcuNTY1NDE0MiwzLjg1MzE2MjMzIDE3LjA3NDkzMDYsMy40MTc2NDY3IDE2Ljg3MzQ0MDUsMy41MTkzNjYxMiBDMTYuNjIyMDgxMiwzLjY0NjU5MzY1IDE3LjM3Njc3ODYsMy4yMTM3MzgzNyAxNi45OTkzNTI1LDMuMjQ5NDE4NDIgQzE2LjgyNjM1OSwzLjI2NTY5MzUyIDE2LjQzMzI5MDcsMy4xOTE2NzMwOCAxNi4xODE0NjY4LDMuMzc2NDg5NDUgQzE1LjkxMTgzMjUsMy41NzQ5MjA1OCAxNi4yNDQ1MDAyLDMuMDI3MDQ0MSAxNi4wMDg2MjgzLDMuMzI4NzU5NTcgQzE1Ljc5NjI5NzEsMy42MDA0Mjg2OCAxNC44NzM3MTcxLDMuNTEyNzkzNDkgMTQuNjEwMTIyOCwzLjcxMjE2MzU2IEMxNC42ODQ2MTY5LDMuNTYxMzA1ODMgMTQuNzcyMjc1MSwzLjM1OTkwMTM2IDE0LjcwMzM1NjUsMy40NTU4MzA2MSBDMTQuNTc3NDQ0NiwzLjYzMDYzMTUzIDE0LjAyNzAyNTEsMy45MzI2NTk5OCAxMy43NTk1NTksNC4yMDI2MDc2OSBDMTMuNDkyMjQ3Nyw0LjQ3MzAyNDg3IDE0LjE1Mjc4MjEsMy42NjIzOTkyOSAxMy44Njk2NzM4LDMuODg0NzczNiBDMTMuNTUzMjY3OCw0LjEzMzc1MTQ2IDEzLjA4MzIyNzUsNC4zNjE2MDI5NyAxMi45MTAzODg5LDQuNzc1MDUzMzIgQzEyLjczNzI0MDYsNS4xODgwMzQxOSAxMi43NTMwMzc3LDQuMDkxNjU1MjcgMTIuNzM3MjQwNiw0LjUzNjQwMzkgQzEyLjcyODU2NzcsNC43ODc0MTYxNCAxMi40MjI4NDc5LDQuOTE3NzczNSAxMi4yOTcwOTA5LDUuMjAzOTk2MzIgQzEyLjE3MDg2OTIsNS40OTA2ODg2MSAxMi4yNjA2OTU2LDQuOTc0MTEwNDEgMTIuMDc5MzM5MSw1LjM5NzczMjcgQzExLjkzMjY3NDEsNS43NDA0NDg5MiAxMS44NzI0Mjg0LDUuNTUzNDQxNjcgMTEuNjgzNjM3OSw2LjE0MTM3OTk1IEMxMS40OTQ4NDc0LDYuNzI5NDc0NzMgMTEuNDQ3NzY2LDYuMTI1NTc0MzIgMTEuMjU5MTMwMyw2LjYzNDE3MTQ1IEMxMS4wNzA0OTQ3LDcuMTQyNjEyMDkgMTEuMDIzMTAzNSw3LjYzNTI0NzEgMTAuNzU1OTQ3Miw4LjUyNTIxMzgzIEMxMC40OTE4ODgzLDkuNDAyODE3NzQgMTAuODA5Njg4MiwxMi4wNzI0MDUgMTEuMDc0OTg2MSwxMi42OTQxNDU0IEMxMS4wMTQyNzU3LDEyLjY4NTM4MTkgMTAuOTQ1ODIxOCwxMi42ODgzNTUyIDEwLjg3MTMyNzcsMTIuNzEzODYzMyBDMTAuNTQwOTgzMSwxMi44MjY2OTM2IDExLjIzNjY3MzcsMTMuNzIyNzYzNSAxMS4zNDY5NDM1LDE0LjEwNDEzMzEgQzExLjQ1Njc0ODYsMTQuNDg1NjU5MiAxMS40MzczODk1LDE0Ljc0NjIxNzQgMTEuNjU3NDY0MywxNS4zNTAyNzQzIEMxMS44Nzc1MzkyLDE1Ljk1NDAxODMgMTIuMzgxMzQxOSwxNS42NzUzMDcgMTIuMzgxMzQxOSwxNS42NzUzMDcgTDEyLjk4OTIxOTQsMTguMjE4NjA1NyBMMTIuNzY4OTg5NywyMC41NzA1MTUzIEMxMi43Njg5ODk3LDIwLjU3MDUxNTMgMTAuMDA2MDUwOSwyMS4zMjYwNTU5IDguNjY1NjIyOTEsMjEuNTA4MDU1NCBDNC4yMjAxNDExNywyMi4xMTE0ODY0IDIuODc4MDA5NTksMjMuODkxNzMyOCAyLjI2NDg2NjQsMjQuNzM0MTI2MiBDMS42NTE0MTM0NiwyNS41NzYyMDY1IDAsMzIuNzE5MTAxMSAwLDMyLjcxOTEwMTEgTDMxLjYyMzg3ODUsMzIuNzE5MTAxMSBDMzEuNjIzODc4NSwzMi43MTkxMDExIDMxLjI2MjA5NDYsMjguMDU1MTg3MiAzMC41NzAxMjA5LDI1LjcwMzI3NzYiIGZpbGw9IiM5N0JFMzIiIG1hc2s9InVybCgjbWFzay0zKSI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgICAgICA8bWFzayBpZD0ibWFzay01IiBmaWxsPSJ3aGl0ZSI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9IiNwYXRoLTQiPjwvdXNlPgogICAgICAgICAgICAgICAgICAgICAgICA8L21hc2s+CiAgICAgICAgICAgICAgICAgICAgICAgIDxlbGxpcHNlIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIyIiBjeD0iMTUuODM0NTU0NCIgY3k9IjE2IiByeD0iMTQuODM0NTU0NCIgcnk9IjE1Ij48L2VsbGlwc2U+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=');
    const material2 = new THREE.MeshPhongMaterial({ map: texture, side: THREE.DoubleSide, transparent: true });
    const markers = [];
    const height = 1;

    this.control.rotateSpeed = 0.5;

    for (let i = customData.length - 1; i >= 0; i--) {
      const lat = customData[i].Latitude;
      const lng = customData[i].Longtitude;
      const radio = this.props.radius;
      const position = latLongToVector3(lat, lng, radio, height + (i * 0.2));

      const geometry = new THREE.PlaneGeometry(32, 32);
      const marker = new THREE.Mesh(geometry, material2);

      marker.position.set(position.x, position.y, position.z);
      marker.lookAt(new THREE.Vector3(0, 0, 0));
      marker.data = customData[i];

      markers.push(marker);
      this.scene.add(marker);
    }

    this.markers = markers;
  }

  draw() {
    requestAnimationFrame(this.draw.bind(this));
    this.control.update();
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (
        <div ref={(node) => this.el = node} className="vizz-component-globe z2" />
    );
  }

}

GlobeComponent.defaultProps = {
  width: window.innerWidth,
  height: 500,
  radius: 205,
  autorotate: true,
  velocity: 0.25,
  scrollTop: 0,
  earthImage: earthImage,
  earthBumpImage: earthBumpImage
};

GlobeComponent.propTypes = {
  autorotate: React.PropTypes.bool,
  width: React.PropTypes.number,
  scrollTop: React.PropTypes.number,
  height: React.PropTypes.number,
  velocity: React.PropTypes.number,
  radius: React.PropTypes.number,
  earthImage: React.PropTypes.string,
  earthBumpImage: React.PropTypes.string
};

export default GlobeComponent;
