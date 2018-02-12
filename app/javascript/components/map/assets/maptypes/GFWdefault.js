const name = 'GFWdefault';
const style = [
  {
    featureType: 'administrative',
    stylers: [
      {
        saturation: -100
      }
    ]
  },
  {
    featureType: 'administrative.land_parcel',
    stylers: [
      {
        visibility: 'off'
      }
    ]
  },
  {
    featureType: 'administrative.neighborhood',
    stylers: [
      {
        visibility: 'off'
      }
    ]
  },
  {
    featureType: 'landscape',
    stylers: [
      {
        saturation: -100
      },
      {
        lightness: 90
      }
    ]
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ffffff'
      }
    ]
  },
  {
    featureType: 'poi',
    stylers: [
      {
        visibility: 'off'
      }
    ]
  },
  {
    featureType: 'road',
    stylers: [
      {
        saturation: -100
      },
      {
        visibility: 'off'
      }
    ]
  },
  {
    featureType: 'transit',
    stylers: [
      {
        saturation: -100
      },
      {
        visibility: 'off'
      }
    ]
  },
  {
    featureType: 'water',
    stylers: [
      {
        hue: '#b3e2ff'
      }
    ]
  }
];

const GFWdefault = function () {
  return new google.maps.StyledMapType(style, { name }); // eslint-disable-line
};

export default GFWdefault;
