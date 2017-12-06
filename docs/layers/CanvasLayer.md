# Canvas Layer

Canvas Layers are pretty cool. You'll look in the layer files and see
scary things like `(72 - z) + 102 - (3 * myscale(intensity) / z)`, but
really it's quite simple: their purpose is to allow data (such as date)
to be encoded in pixels within map tiles. These tiles can then be
further processed -- for example, a single map tile can be used to
encode 15 years of forest loss data, with some code using this encoded
data to decide what to display based on a selected date range.

The base CanvasLayerClass...

  * Takes requests from the map for tiles
  * Retrieves the tile from a tile server (like Google Earth Engine or CartoDB)
  * Renders the tile image to a <canvas>
  * Pulls the raw image data from the <canvas>
  * Runs some filtering code over the <canvas> to process the image
  * Re-renders the final filtered image

The CanvasLayerClass isn't used directly, but is instead extended from
by actual layers, such as `LossLayer`. These layers are expected to
implement a `filterCanvasImgdata` method, which processes the pixel data
in some way (such as only showing pixels within the current date range)
and returns the data to be rendered on the canvas layer.

### Adding Layers

When adding a new layer make sure to update `gfw/app/assets/javascripts/map/models/layerSpecModel.js` by adding the slug from LayerSpec to the `LayerOrder`.

Note that LayerOrder prioritised layers found towards the *bottom* of the list! Hence, if you want your layer to sit beneath another, place it near the top. Alternatively, if you want your layer to be on top of the stack, place it at the bottom. 

**If you do not add the slug to `LayerOrder`, by default, the layer will sit at the bottom of the layer stack - so you may not be able to see it!**