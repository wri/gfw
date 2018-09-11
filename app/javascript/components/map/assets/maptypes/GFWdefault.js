const name = 'GFWdefault';
const baseStyle = [
  {
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off'
      }
    ]
  },
  {
    featureType: 'administrative',
    stylers: [
      {
        saturation: '-100'
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
        saturation: '-100'
      },
      {
        lightness: '90'
      }
    ]
  },
  {
    featureType: 'landscape',
    elementType: 'labels',
    stylers: [
      {
        color: '#333333'
      },
      {
        saturation: '50'
      },
      {
        invert_lightness: true
      },
      {
        lightness: '50'
      },
      {
        weight: '0.3'
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
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        visibility: 'off'
      }
    ]
  },
  {
    featureType: 'poi.park',
    elementType: 'labels',
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
        saturation: '-100'
      }
    ]
  },
  {
    featureType: 'transit',
    stylers: [
      {
        saturation: '-100'
      }
    ]
  },
  {
    featureType: 'water',
    stylers: [
      {
        hue: '#B3E2FF'
      }
    ]
  }
];

const GFWdefault = () => new google.maps.StyledMapType(baseStyle, { name }); // eslint-disable-line

export default GFWdefault;
