#encoding: UTF-8
class CountriesController < ApplicationController
  def show

    @name = params[:id].capitalize

    countries = {
      "brazil" => OpenStruct.new({
      name: 'Brazil',
      country_code: 'BRA',
      sqkm: "8533146.02881505",
      description: "Due to the vastness of the Amazon rainforest, Brazil's average loss of 34,660 square kilometers of primary forest per year between 2000 and 2005 represents only about 0.8 percent of its forest cover. Nevertheless, deforestation in Brazil is one of the most important global environmental issues today. Brazil holds about one-third of the world's remaining rainforests, including a majority of the Amazon rainforest. It is also overwhelmingly the most biodiverse country on Earth, with more than 56,000 described species of plants, 1,700 species of birds, 695 amphibians, 578 mammals, and 651 reptiles. In many tropical countries, the majority of deforestation results from the actions of poor subsistence cultivators. Today deforestation in the Amazon is the result of several activities including clearing for cattle pasture, colonization and subsequent subsistence agriculture, infrastructure improvements, commercial agriculture (e.g. soy) and logging.",
      wikipedia_link: 'http://en.wikipedia.org/wiki/Brazil',
      link: "/map/4/-16.52/-54.55"
    }),
      "cameroon" => OpenStruct.new({
      name: 'Cameroon',
      country_code: 'CMR',
      sqkm: "465249.792190389",
      description: "Overall, Cameroon lost 13.4 percent of its forest cover or 3.3 million hectares between 1990 and 2005 and deforestation rates have increased by 10 percent since the close of the 1990s. In the recovery following economic crisis caused by the devaluation of the CFA Franc, building and public works projects increased domestic demand for timber products. Besides logging for domestic and export markets, deforestation results from fuelwood collection and subsistence farming.",
      wikipedia_link: 'http://en.wikipedia.org/wiki/Cameroon',
      link: "/map/7/3.87/12.48/570"
    }),
      "malaysia" => OpenStruct.new({
      name: 'Malaysia',
      sqkm: "328141.138304178",
      country_code: 'MYS',
      description: "Malaysia's deforestation rate is accelerating faster than that of any other tropical country in the world, according to data from the United Nations. Analysis of figures from the Food and Agriculture Organization of the United Nations (FAO) shows that Malaysia's annual deforestation rate jumped almost 86 percent between the 1990-2000 period and 2000-2005. Declining forest cover in Malaysia results primarily from urbanization, agricultural fires, and forest conversion for oil-palm plantations and other forms of agriculture. Logging, which is generally excluded in deforestation figures from FAO, is responsible for widespread forest degradation in the country, and green groups have accused local timber companies of failing to practice sustainable forest management.",
      wikipedia_link: 'http://en.wikipedia.org/wiki/Malaysia',
      link: "/map/6/3.61/107.98"
    }),
      "india" => OpenStruct.new({
      name: 'India',
      description: "India (i/ˈɪndiə/), officially the Republic of India (Bhārat Gaṇarājya),[c] is a country in South Asia. It is the seventh-largest country by geographical area, the second-most populous country with over 1.2 billion people, and the most populous democracy in the world. Bounded by the Indian Ocean on the south, the Arabian Sea on the south-west, and the Bay of Bengal on the south-east, it shares land borders with Pakistan to the west;[d] China, Nepal, and Bhutan to the north-east; and Burma and Bangladesh to the east. In the Indian Ocean, India is in the vicinity of Sri Lanka and the Maldives; in addition, India's Andaman and Nicobar Islands share a maritime border with Thailand and Indonesia.",
      wikipedia_link: 'http://en.wikipedia.org/wiki/India',
      link: "/map/5/18.10/78.56"
    }),
      "indonesia" => OpenStruct.new({
      name: 'Indonesia',
      sqkm: "1888723.59702349",
      country_code: 'IDN',
      description: "Indonesia houses the most extensive rain forest cover in all of Asia, though it is rapidly developing these lands to accommodate its increasing population and growing economy. Today just under half of Indonesia is forested, representing a significant decline in its original forest cover. Indonesia's forests are being degraded and destroyed by logging, mining operations, large-scale agricultural plantations (e.g. oil palm), colonization, and subsistence activities like shifting agriculture and cutting for fuel wood. The effects from forest loss have been widespread, including irregular river flows, soil erosion, and reduced yield from of forest products. Pollution from chlorine bleach used in pulp bleaching and run-off from mines has damaged river systems and adjacent cropland, while wildlife poaching has reduced populations of several conspicuous species including the orangutan (endangered), Bali and Javan tigers (extinct), and Javan and Sumatran rhinos (on the brink of extinction).",
      wikipedia_link: 'http://en.wikipedia.org/wiki/Indonesia',
      link: "/map/5/-4.92/119.25"
    })
    }

    @country = countries[params[:id]]
    @country.last_alerts = Alert.alerts_per_month_per_country(@country.country_code)

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
