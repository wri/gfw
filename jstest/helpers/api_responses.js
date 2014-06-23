var ApiResponse = {
 	forma_alerts: {
  	iso: {
  		success: {
  			status: 200,
  			responseText: '{"data": {}}'
  		},
      notfound: {
        status: 404,
        responseText: '404'
      },
      failure: {
        status: 400,
        responseText: '{"error": {}}'
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
