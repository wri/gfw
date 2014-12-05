/**
 * The Forest2000 layer module for use on canvas.
 *
 * @return ForestLayer class (extends CanvasLayerClass)
 */
define([
  'd3',
  'uri',
  'abstract/layer/CanvasLayerClass',
  'map/presenters/TerraiCanvasLayerPresenter'
], function(d3,UriTemplate, CanvasLayerClass, Presenter) {

  'use strict';

  var TerraiCanvasLayer = CanvasLayerClass.extend({

    options: {
      threshold: 30,
      dataMaxZoom: 12,
      //ATTENTION: check config.ru file to get the whole route, reverse proxying here
      //urlTemplate: '/latin-america/Z{z}/{y}/{x}.png'
      urlTemplate: 'http://wri-tiles.s3-website-us-east-1.amazonaws.com/terra_i_loss_julian/{z}/{x}/{y}.png'
      
    },

    init: function(layer, options, map) {
      this.presenter = new Presenter(this);
      this.currentDate = options.currentDate || [moment(layer.mindate), moment(layer.maxdate)];
      this._super(layer, options, map);
    },

    /**
     * Filters the canvas imgdata.
     * @override
     */
    filterCanvasImgdata: function(imgdata, w, h) {
      var components = 4;
      var zoom = this.map.getZoom();

      var start= (moment(this.currentDate[0]).year()-2004)*23+Math.floor(moment(this.currentDate[0]).dayOfYear()/16);
      var end= (moment(this.currentDate[1]).year()-2004)*23+Math.floor(moment(this.currentDate[1]).dayOfYear()/16);


      for(var i=0; i < w; ++i) {
        for(var j=0; j < h; ++j) {
          var pixelPos = (j*w + i) * components;
          var r = imgdata[pixelPos];
          var g = imgdata[pixelPos+1];
          var b = imgdata[pixelPos+2];
          //var yearLoss = 2003 + imgdata[pixelPos]%16;

          var timeLoss=b+(256*g)
         // yearagg[yearLoss]+=1;


          if (timeLoss > start && timeLoss < end) {
            imgdata[pixelPos] = 220;
            imgdata[pixelPos + 1] = 102 ;
            imgdata[pixelPos + 2] = 153 ;
            imgdata[pixelPos + 3] = 256;
          } else {
            imgdata[pixelPos + 3] = 0;
          }

        }

      }
    },

    /**
     * Used by TerraiCanvasLayerPresenter to set the dates for the tile.
     *
     * @param {Array} date 2D array of moment dates [begin, end]
     */
    setTimelineDate: function(date) {
      this.currentDate = date;
      this.updateTiles();
    },
  });

  return TerraiCanvasLayer;

});
