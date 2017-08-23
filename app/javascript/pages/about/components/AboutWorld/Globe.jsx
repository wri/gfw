import React from 'react';
import * as THREE from 'three';
import orbitControl from 'three-orbit-controls';

const Control = orbitControl(THREE);

class GlobeComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      scrollTop: props.scrollTop
    };
  }

  componentDidMount() {
    this.scene = new THREE.Scene();
    this.imageLoader = new THREE.TextureLoader();
    this.camera = new THREE.PerspectiveCamera(27, this.props.width / this.props.height, 1, 1500);
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    this.renderer.setSize(this.props.width, this.props.height);

    this.el.appendChild(this.renderer.domElement);

    this.addControls();
    this.addLights();
    this.addGlobe();

    this.camera.position.z = 880;

    this.draw();
  }

  addControls() {
    this.control = new Control(this.camera, this.renderer.domElement);
    this.control.enableDamping = true;
    this.control.dampingFactor = 0.1;
    this.control.autoRotate = this.props.autorotate;
    this.control.enablePan = false;
    this.control.enableZoom = false;
    this.control.rotateSpeed = 0.1;
    this.control.autoRotateSpeed = this.props.velocity;
  }

  addLights() {
    const ambientLight = new THREE.AmbientLight(0x333333);
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(5, 3, 40);
    this.scene.add(ambientLight);
    this.scene.add(this.directionalLight);
  }

  addGlobe() {
    const material = new THREE.MeshPhongMaterial({
      map: this.imageLoader.load(this.props.basemapImage),
      bumpMap: this.imageLoader.load(this.props.earthBumpImage),
      bumpScale: 2
    });
    const geometry = new THREE.SphereGeometry(this.props.radius, 40, 30);
    const earth = new THREE.Mesh(geometry, material);
    earth.rotation.y = Math.PI;
    earth.updateMatrix();

    this.scene.add(earth);
  }

  draw() {
    requestAnimationFrame(this.draw.bind(this));
    this.directionalLight.position.copy(this.camera.position);
    this.control.update();
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (
      <div ref={(node) => { this.el = node; }} className="vizz-component-globe" />
    );
  }

}

GlobeComponent.defaultProps = {
  radius: 200,
  autorotate: true,
  velocity: 0.15,
  scrollTop: 0
};

GlobeComponent.propTypes = {
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  radius: React.PropTypes.number,
  autorotate: React.PropTypes.bool,
  velocity: React.PropTypes.number,
  scrollTop: React.PropTypes.number,
  basemapImage: React.PropTypes.string,
  earthBumpImage: React.PropTypes.string
};

export default GlobeComponent;