const labelStyle = [
  {
    featureType: 'administrative',
    stylers: [
      {
        saturation: '-100'
      }
    ]
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.fill',
    stylers: [
      {
        visibility: 'simplified'
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
    elementType: 'geometry.fill',
    stylers: [
      {
        visibility: 'off'
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
    elementType: 'geometry.fill',
    stylers: [
      {
        visibility: 'simplified'
      }
    ]
  }
];

const GFWLabels = () => new google.maps.StyledMapType(labelStyle, { name }); // eslint-disable-line

export default GFWLabels;
