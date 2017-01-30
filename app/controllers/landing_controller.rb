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
          "Track deforestation in the habitats you protect.",
          "Tell your organization's conservation story on our interactive map.",
          "Analyze the local impacts of deforestation to design smarter projects.",
          "Hold companies and governments accountable by monitoring land use changes."
        ]
      },
      {
        "profile" => "Policymakers",
        "examples" => [
          "Stay informed about deforestation trends in your country.",
          "Identify and prosecute illegal deforestation activity.",
          "Support your case for conservation policy with data-driven evidence.",
          "Help your forest rangers effectively patrol and manage forests."

        ]
      },
      {
        "profile" => "Companies",
        "examples" => [
          "Identify deforestation in your supply chains.",
          "Get the information you need to engage with sustainable suppliers.",
          "Reduce environmental risk in your investments.",
          "Stay informed about deforestation hot spots to reduce your footprint."
        ]
      },
      {
        "profile" => "Journalists",
        "examples" => [
          "Find your next big environmental story by tracking deforestation hot spots.",
          "Follow today's biggest challenges to land use and conservation.",
          "Track how companies and investments are impacting forests.",
          "Talk to our experts to gain insights about deforestation."
        ]
      }
    ]
  end

end
