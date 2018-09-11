import React from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import orbitControl from 'three-orbit-controls';
import earthImage from './img/earth-image.jpg';

import './globe-styles.scss';

function latLongToVector3(lat, lon, radius, height) {
  const phi = lat * (Math.PI / 180);
  const theta = (lon - 180) * (Math.PI / 180);

  const x = -(radius + height) * Math.cos(phi) * Math.cos(theta);
  const y = (radius + height) * Math.sin(phi);
  const z = (radius + height) * Math.cos(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
}

const Control = orbitControl(THREE);

class GlobeComponent extends React.Component {
  constructor() {
    super();
    this.markers = [];
    this.state = {
      globeSize: 0
    };
  }

  componentDidMount() {
    this.buildGlobe();
    if (this.props.data) {
      this.addMarkers(this.props.data);
    }
  }

  componentWillUpdate(nextProps) {
    const { data } = nextProps;
    if (data && data !== this.props.data) {
      this.removeMarkers();
      this.addMarkers(data);
    }
  }

  buildGlobe() {
    const width = this.container.clientWidth;
    const height = this.container.clientWidth;

    const fov = 40;
    const near = 1;
    const far = 1250;

    this.scene = new THREE.Scene();
    this.imageLoader = new THREE.TextureLoader();
    this.camera = new THREE.PerspectiveCamera(fov, width / height, near, far);
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    this.camera.position.z = far / (2 * 0.9);
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(
      window.devicePixelRatio ? window.devicePixelRatio : 1
    );

    this.el.appendChild(this.renderer.domElement);

    this.addControls();
    this.addLights();
    this.addGlobe();

    this.scene.add(this.camera);

    this.draw();

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    this.el.addEventListener(
      'click',
      event => {
        event.preventDefault();
        mouse.x = event.offsetX / this.renderer.domElement.clientWidth * 2 - 1;
        mouse.y =
          -(event.offsetY / this.renderer.domElement.clientHeight) * 2 + 1;

        this.camera.updateMatrixWorld();
        raycaster.setFromCamera(mouse, this.camera);
        const intersects = raycaster.intersectObjects(this.scene.children);
        if (intersects && intersects.length > 1) {
          const userData = intersects[0].object.data;
          this.handleClick(userData);
          document.body.style.cursor = 'default';
        }
      },
      false
    );

    this.el.addEventListener(
      'mousemove',
      event => {
        event.preventDefault();
        mouse.x = event.offsetX / this.renderer.domElement.clientWidth * 2 - 1;
        mouse.y =
          -(event.offsetY / this.renderer.domElement.clientHeight) * 2 + 1;

        this.camera.updateMatrixWorld();
        raycaster.setFromCamera(mouse, this.camera);
        const intersects = raycaster.intersectObjects(this.scene.children);
        if (intersects && intersects.length > 1) {
          document.body.style.cursor = 'pointer';
        } else {
          document.body.style.cursor = 'default';
        }
      },
      false
    );
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
    this.control.minPolarAngle = Math.PI / 2;
    this.control.maxPolarAngle = Math.PI / 2;
  }

  addLights() {
    const ambientLight = new THREE.AmbientLight(0xaaaaaa);
    this.directionalLight = new THREE.DirectionalLight(0x9aaab8, 1);
    this.directionalLight.position.set(this.props.width, this.props.height, 0);
    this.scene.add(ambientLight);
    this.camera.add(this.directionalLight);
  }

  addGlobe() {
    const material = new THREE.MeshPhongMaterial({
      map: this.imageLoader.load(this.props.earthImage),
      bumpScale: 4
    });
    const geometry = new THREE.SphereGeometry(this.props.radius, 50, 50);
    const earth = new THREE.Mesh(geometry, material);
    earth.updateMatrix();
    this.earth = earth;
    this.scene.add(earth);
  }

  handleClick(data) {
    this.props.onClick(data);
  }

  getUserIcon() {
    const texture = new THREE.TextureLoader().load(
      'data:image/png;base64,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'
    );
    texture.minFilter = THREE.LinearFilter;
    return new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true
    });
  }

  getTextLabel(text) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 50;

    context.beginPath();
    context.fillStyle = 'white';
    context.strokeStyle = 'black';
    context.font = '60px Fira Sans';
    context.lineWidth = 10;
    context.shadowBlur = 15;
    context.shadowColor = '#000000aa';
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.fill();
    context.shadowColor = 'transparent';
    context.beginPath();
    context.fillStyle = 'black';
    context.fillText(text, 135, 95);
    context.fill();

    const texture = new THREE.Texture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    return new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true
    });
  }

  addMarker(d) {
    const position = latLongToVector3(
      d.latitude,
      d.longitude,
      this.props.radius,
      10
    );

    const mesh =
      d.cluster && d.cluster.length > 1
        ? [
          new THREE.PlaneGeometry(50, 25),
          this.getTextLabel(d.cluster.length, 50)
        ]
        : [new THREE.PlaneGeometry(25, 25), this.getUserIcon()];
    const marker = new THREE.Mesh(...mesh);
    marker.position.set(position.x, position.y, position.z);
    marker.lookAt(this.camera.position);
    marker.data = d;

    return [marker];
  }

  addMarkers(data) {
    let markers = [];

    this.control.rotateSpeed = 0.5;
    if (data && data.length) {
      data.forEach(d => {
        markers = markers.concat(this.addMarker(d));
      });
      markers.forEach(marker => {
        this.scene.add(marker);
      });
    }

    this.markers = markers;
  }

  removeMarkers() {
    this.control.rotateSpeed = 0.1;
    if (this.markers && this.markers.length) {
      for (let i = this.markers.length - 1; i >= 0; i--) {
        this.scene.remove(this.markers[i]);
      }
    }
  }

  draw() {
    requestAnimationFrame(this.draw.bind(this));
    this.control.update();
    if (this.markers.length) {
      for (let i = this.markers.length - 1; i >= 0; i--) {
        this.markers[i].lookAt(this.camera.position);
      }
    }
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (
      <div
        ref={node => {
          this.container = node;
        }}
        className="c-globe"
      >
        <div
          ref={node => {
            this.el = node;
          }}
          className="vizz-component-globe z2"
        />
      </div>
    );
  }
}

GlobeComponent.defaultProps = {
  width: window.innerWidth,
  height: 500,
  radius: 205,
  autorotate: true,
  velocity: 0.25,
  earthImage
};

GlobeComponent.propTypes = {
  autorotate: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
  velocity: PropTypes.number,
  radius: PropTypes.number,
  earthImage: PropTypes.string,
  data: PropTypes.array,
  onClick: PropTypes.func
};

export default GlobeComponent;
