#encoding: UTF-8
class CountriesController < ApplicationController
  
  def show

    country_info = Country.country_info(params[:id])

    @country = OpenStruct.new({
      name: country_info[0].name,
      about: country_info[0].about,
      wikipedia_link: country_info[0].wikipedia_link,
      lat: country_info[0].lat.to_s,
      lon: country_info[0].lon.to_s,
      link: country_info[0].map_coord,
      iso:  country_info[0].iso,
      last_alerts: Alert.alerts_per_month_per_country(country_info[0].iso)
    })

    @blog_posts = [];

    post = OpenStruct.new( {
      title: 'Global Forest Watch 2.0 at Rio+20',
      link:  'http://gfw20.tumblr.com/post/25154304598/global-forest-watch-2-0-at-rio-20',
      body:  "In June 2012, the United Nations’ is hosting a global sustainable development summit in Rio de Janeiro, 20 years after the first Earth Summit . The official themes of Rio+20 are: “a green economy in the context of sustainable development poverty eradication”; and the “institutional framework for sustainable development”"
    })
    @blog_posts.push(post)

    post = OpenStruct.new({
      title: 'New study highlights opportunities and challenges for IFM',
      link: 'http://gfw20.tumblr.com/post/25154024940/new-study-highlights-opportunities-and-challenges-for',
      body: "Today WRI releases a working paper that provides new information about Indonesia’s moratorium on new forest concessions. Our analysis concludes that the moratorium alone does not significantly contribute to Indonesia’s greenhouse gas emission reduction goal of 26 percent by 2020. However, the moratorium does support these goals in the long-term by “pausing” business-as-usual patterns to allow time for needed governance reforms."
    })
    @blog_posts.push(post)

    post = OpenStruct.new({
      title: 'Forest land allocation in Cameroon',
      link: 'http://gfw20.tumblr.com/post/25153822817/forest-land-allocation-in-cameroon',
      body: "With its Sahelian north and dense tropical rainforest south, Cameroon is a land of diversity and transition. A combination of either dense or mosaic forest landscapes covers about 60% of the nearly 47 million hectare country. "
    })
    @blog_posts.push(post)

  end
end
