import React from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import orbitControl from 'three-orbit-controls';
import markerFellow from 'assets/icons/markers/marker_fellow.png';
import markerGrantee from 'assets/icons/markers/marker_grantee.png';
import earthImage from './img/earth-image.jpg';

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

  getUserIcon(isFellow) {
    const texture = new THREE.TextureLoader().load(
      isFellow ? markerFellow : markerGrantee
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

    const isFellow =
      d.cluster &&
      d.cluster.length === 1 &&
      d.cluster[0].categories.indexOf('Fellow') !== -1;

    const mesh =
      d.cluster && d.cluster.length > 1
        ? [
          new THREE.PlaneGeometry(50, 25),
          this.getTextLabel(d.cluster.length, 50)
        ]
        : [new THREE.PlaneGeometry(25, 25), this.getUserIcon(isFellow)];
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
