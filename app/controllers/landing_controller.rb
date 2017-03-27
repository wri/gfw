class LandingController < ApplicationController
  layout 'landing'
  def is_number?(string)
    true if Float(string) rescue false
  end

  def index
    require 'open-uri'
    @title = 'Forest monitoring designed for action'
    @desc = 'Global Forest Watch offers the latest data, technology and tools that empower people everywhere to better protect forests.'
    @keywords = 'forests, forest data, forest monitoring, forest landscapes, maps, gis, visualize, geospatial, forest analysis, forest news, forest alerts, conservation, forest updates, forest watch, analysis, deforestation, deforesting, tree cover loss, explore forests, mapping, trees, forest loss'
    @summary = [
      {
        "title" => "Be the first to see new deforestation",
        "paragraph" => "Subscribe and get email notifications straight to your inbox as forest clearing happens.",
        "button" => "SUBSCRIBE TO ALERTS",
        "url" => "/my_gfw/subscriptions/new"
      },
      {
        "title" => "Discover the world’s forests through data",
        "paragraph" => "Explore over 100 global and local data sets to learn about conservation, land use, forest communities, and much more.",
        "button" => "EXPLORE OUT DATA",
        "url" => "/map"
      },
      {
        "title" => "Research made easy",
        "paragraph" => "Analyze forest change and investigate trends anywhere in the world with just a few clicks.",
        "button" => "START YOUR RESEARCH",
        "url" => "/map/3/15.00/27.00/ALL/grayscale/loss,forestgain?tab=analysis-tab&begin=2001-01-01&end=2015-01-01&threshold=30&dont_analyze=true"
      },
      {
        "title" => "A suite of tools",
        "paragraph" => "Find out about the connections between deforestation and climate change, fires and haze, water security, and commodity supply chains with our specialized web applications.",
        "button" => "BROWSE OUR APPS",
        "url" => "/gallery"
      },
      {
        "title" => "Expert insights",
        "paragraph" => "Read the latest stories and findings about forests from our team of researchers.",
        "button" => "START LEARNING",
        "url" => "http://blog.globalforestwatch.org/"
      }
    ]
    @uses = [
      {
        "profile" => "Conservation Orgs",
        "examples" => [
          "The Amazon Conservation Association (ACA) works to protect biodiversity in the Amazon. With GLAD deforestation alerts on Global Forest Watch, we can detect illegal gold mining and logging in protected areas within days. By getting timely and precise information into the hands of policymakers, we've seen government authorities on the ground taking action within 24-48 hours of receiving an alert."
        ]
      },
      {
        "profile" => "Policymaker",
        "examples" => [
          "At the Forest Development Authority in Liberia, we saw a need to improve science-based decision making in forest resource management. We developed a Forest Atlas with Global Forest Watch that allows us to manage and share information about forest cover and land use. The Forest Atlas revolutionized how we communicate about the forest sector in Liberia."

        ]
      },
      {
        "profile" => "Journalist",
        "examples" => [
          "Mongabay is a science-based environmental news platform aiming to inspire, educate, and inform the public. The deforestation and fire alerts on GFW allow us to identify stories as they're happening on the ground. In Peru, we were able to track fires as they invaded protected areas and mobilize our Latin America team to get coverage. It added a really timely dimension to our reporting and led Peruvian officials to go out immediately and address the situation."
        ]
      },
      {
        "profile" => "Company",
        "examples" => [
          ""
        ]
      }
    ]
    @apps = [
      {
        "key" => "fires",
        "title" => "Fires",
        "description" => "Track fires and haze in the ASEAN region. View the latest data on fire locations and air quality and do you own analysis",
        "background" => "/assets/home/fires@2x.png",
        "link" => "http://fires.globalforestwatch.org"
      },
      {
        "key" => "climate",
        "title" => "Climate",
        "description" => "Track carbon emissions and removals in forest landscapes",
        "background" => "/assets/home/climate@2x.png",
        "link" => "http://climate.globalforestwatch.org"
      },
      {
        "key" => "commodities",
        "title" => "Commodities",
        "description" => "Identify deforestation risk in commodity supply chains",
        "background" => "/assets/home/commodities@2x.png",
        "link" => "http://commodities.globalforestwatch.org"
      },
      {
        "key" => "water",
        "title" => "Water",
        "description" => "View critical watershed information, understand type and severity of threats such as forest changes to watershed health, and screen for cost-effective, sustainable solutions",
        "background" => "/assets/home/water@2x.png",
        "link" => "http://water.globalforestwatch.org/"
      }
    ]
  end

end
