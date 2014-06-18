var ApiResponse = {
 	forma_alerts: {
  	iso: {
  		success: {
  			status: 200,
  			responseText: '{"coverage": "Humid tropical forest biome", "description": "Alerts where forest disturbances have likely occurred.", "id": "forma-alerts", "iso": "bra", "name": "FORMA", "resolution": "500 x 500 meters", "source": "MODIS", "timescale": "January 2006 to present", "units": "Alerts", "updates": "16 day", "value": 1088866}'
  		},
      notfound: {
        status: 404,
        responseText: '<html><head><title>404 Not Found</title></head><body><h1>404 Not Found</h1>The resource could not be found.<br/><br/></body></html>'
      }
  	},
  	wdpa: {
      success: {
        status: 200,
        responseText: '{"coverage": "Humid tropical forest biome", "description": "Alerts where forest disturbances have likely occurred.", "id": "forma-alerts", "name": "FORMA", "resolution": "500 x 500 meters", "source": "MODIS", "timescale": "January 2006 to present", "units": "Alerts", "updates": "16 day", "value": 847, "wdpaid": "8950"}'
      }
  	}
  }
 };
