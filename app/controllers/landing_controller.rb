class LandingController < ApplicationController

  def index
    require 'open-uri'
    @title = 'Forest Monitoring Designed for Action'
    @desc = 'Global Forest Watch offers the latest data, technology and tools that empower people everywhere to better protect forests.'
    @keywords = 'forests, forest data, forest monitoring, forest landscapes, maps, gis, visualize, geospatial, forest analysis, forest news, forest alerts, conservation, forest updates, forest watch, analysis, deforestation, deforesting, tree cover loss, explore forests, mapping, trees, forest loss'
    @summary = [
      {
        "title" => "Discover the world’s forests through data",
        "paragraph" => "Explore over 100 global and local data sets to learn about conservation, land use, forest communities, and much more.",
        "button" => "EXPLORE OUR DATA",
        "url" => "/map?menu=eyJkYXRhc2V0Q2F0ZWdvcnkiOiJmb3Jlc3RDaGFuZ2UiLCJtZW51U2VjdGlvbiI6ImRhdGFzZXRzIn0%3D",
        "background_orientation" => "left"
      },
      {
        "title" => "Be the first to see new tropical deforestation",
        "paragraph" => "View, analyze, and subscribe to get weekly GLAD deforestation alerts that show where tree cover loss is happening right now in the tropics.",
        "button" => "VIEW GLAD ALERTS",
        "url" => "/map?analysis=eyJzaG93QW5hbHlzaXMiOnRydWUsImhpZGRlbiI6ZmFsc2V9&map=eyJ6b29tIjozLCJjZW50ZXIiOnsibGF0IjotNC4yMTQ5NDMxNDEzOTA2MzksImxuZyI6LTUuODAwNzgxMjUwMDAwMDAxfSwiY2FuQm91bmQiOmZhbHNlLCJiYm94IjpudWxsLCJkYXRhc2V0cyI6W3siZGF0YXNldCI6ImU2NjNlYjA5LTA0ZGUtNGYzOS1iODcxLTM1YzZjMmVkMTBiNSIsIm9wYWNpdHkiOjEsInZpc2liaWxpdHkiOnRydWUsImxheWVycyI6WyJkZDVkZjg3Zi0zOWMyLTRhZWItYTQ2Mi0zZWY5NjliMjBiNjYiXX0seyJkYXRhc2V0IjoiZmRjOGRjMWItMjcyOC00YTc5LWIyM2YtYjA5NDg1MDUyYjhkIiwibGF5ZXJzIjpbIjZmNjc5OGU2LTM5ZWMtNDE2My05NzllLTE4MmE3NGNhNjVlZSIsImM1ZDFlMDEwLTM4M2EtNDcxMy05YWFhLTQ0ZjcyOGMwNTcxYyJdLCJvcGFjaXR5IjoxLCJ2aXNpYmlsaXR5Ijp0cnVlfV19&menu=eyJtZW51U2VjdGlvbiI6IiIsImRhdGFzZXRDYXRlZ29yeSI6IiJ9",
        "background_orientation" => "left"
      },
      {
        "title" => "Quick global and country stats",
        "paragraph" => "Analyze forest change and investigate trends anywhere in the world with just a few clicks.",
        "button" => "EXPLORE THE DASHBOARDS",
        "url" => "/dashboards/global",
        "background_orientation" => "left"
      },
      {
        "title" => "Forest insights",
        "paragraph" => "Read the latest stories and findings about forests from our team of researchers on the GFW blog.",
        "button" => "START LEARNING",
        "url" => "http://blog.globalforestwatch.org/",
        "background_orientation" => "left"
      },
      {
        "title" => "A suite of tools",
        "paragraph" => "Find out about the connections between deforestation and climate change, fires and haze, water security, and commodity supply chains with our specialized web applications.",
        "button" => "BROWSE OUR APPS",
        "url" => "http://developers.globalforestwatch.org",
        "background_orientation" => "left"
      }
    ]
    @uses = [
      {
        "profile" => "Conservation Orgs",
        "examples" => [
          "The Amazon Conservation Association (ACA) works to protect biodiversity in the Amazon. With GLAD deforestation alerts on Global Forest Watch, we can detect illegal gold mining and logging in protected areas within days. By getting timely and precise information into the hands of policymakers, we've seen government authorities on the ground taking action within 24-48 hours of receiving an alert."
        ],
        "credit" => "<a href=\"https://www.flickr.com/photos/minamperu/9966829933\" target=\"_blank\">MINAMPERÚ</a>"
      },
      {
        "profile" => "Policymaker",
        "examples" => [
          "At the Forest Development Authority in Liberia, we saw a need to improve science-based decision making in forest resource management. We developed a Forest Atlas with Global Forest Watch that allows us to manage and share information about forest cover and land use. The Forest Atlas revolutionized how we communicate about the forest sector in Liberia."

        ],
        "credit" => "<a href=\"http://www.greenpeace.org/\" target=\"_blank\">Greenpeace International</a>"
      },
      {
        "profile" => "Journalist",
        "examples" => [
          "Mongabay is a science-based environmental news platform aiming to inspire, educate, and inform the public. The deforestation and fire alerts on GFW allow us to identify stories as they're happening on the ground. In Peru, we were able to track fires as they invaded protected areas and mobilize our Latin America team to get coverage. It added a really timely dimension to our reporting and led Peruvian officials to go out immediately and address the situation."
        ],
        "credit" => "<a href=\"https://www.flickr.com/photos/cifor/16425898585\" target=\"_blank\">CIFOR</a>"
      },
      {
        "profile" => "Company",
        "examples" => [
          "At Mars, deforestation poses a risk to our business – we don’t want our supply chains to be associated with serious environmental issues. We used the PALM risk tool on GFW Commodities to evaluate our palm oil suppliers and help us make decisions about where to source from. With GFW, we were able to turn concerns about deforestation into an actionable method for engaging our suppliers."
        ],
        "credit" => "<a href=\"https://www.flickr.com/photos/marufish/4074823996\" target=\"_blank\">Marufish</a>"
      }
    ]
    @apps = [
      {
        "key" => "forestwatcher",
        "title" => "Forest Watcher",
        "description" => "Access GFW's forest monitoring and alert system offline and collect data from the field, all from your mobile device",
        "background" => "/assets/home/forestwatcher@2x.jpg",
        "link" => "http://forestwatcher.globalforestwatch.org/"
      },
      {
        "key" => "fires",
        "title" => "Fires",
        "description" => "Track fires and haze, view the latest data on fire locations and air quality, and do your own analysis",
        "background" => "/assets/home/fires@2x.jpg",
        "link" => "http://fires.globalforestwatch.org"
      },
      {
        "key" => "climate",
        "title" => "Climate",
        "description" => "Track carbon emissions and removals in forest landscapes",
        "background" => "/assets/home/climate@2x.jpg",
        "link" => "http://climate.globalforestwatch.org"
      },
      {
        "key" => "commodities",
        "title" => "Commodities",
        "description" => "Identify deforestation risk in commodity supply chains",
        "background" => "/assets/home/commodities@2x.jpg",
        "link" => "http://commodities.globalforestwatch.org"
      }
    ]
  end

end
