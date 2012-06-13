#encoding: UTF-8
class CountriesController < ApplicationController
  def index
    @country = OpenStruct.new({
      name: 'Central African Republic',
      alerts_count: 2931,
      description: (<<-EOF
        The Central African Republic (CAR) (French: République centrafricaine, pronounced: [ʁepyblik sɑ̃tʁafʁikɛn], or Centrafrique [sɑ̃tʀafʀik]; Sango Ködörösêse tî Bêafrîka), is a landlocked country in Central Africa. It borders Chad in the north, Sudan in the northeast, South Sudan in the east, the Democratic Republic of the Congo and Congo in the south, and Cameroon in the west. The CAR covers a land area of about 240,000 square miles (620,000 km2), and has an estimated population of about 4.4 million as of 2008. Bangui is the capital city.
      EOF
      ),
      last_alerts: [{:date => DateTime.new(2012, 5, 5, 16, 32), :count => 12345}] * 4
    })

    @blog_posts = [
      OpenStruct.new({
        title: 'Kony Tracked by U.S. Forces in Central Africa',
        body: (<<-EOF
          The Central African Republic (CAR) (French: République centrafricaine) is a landlocked country in Central Africa. Sounding like this It borders Chad in the north, Sudan in the northeast, South Sudan in the east, the Democratic Republic of the Congo and... more
        EOF
        ),
      }),

      OpenStruct.new({
        title: 'U.N. Says Congo Rebels Killed Scores...',
        body: (<<-EOF
          The Central African Republic (CAR) (French: République centrafricaine) is a landlocked country in Central Africa. Sounding like this It borders Chad in the north, Sudan in the northeast, South Sudan in the east, the Democratic Republic of the Congo and... more
        EOF
        ),
      }),

      OpenStruct.new({
        title: 'Kony Tracked by U.S. Forces in Central Africa',
        body: (<<-EOF
          The Central African Republic (CAR) (French: République centrafricaine) is a landlocked country in Central Africa. Sounding like this It borders Chad in the north, Sudan in the northeast, South Sudan in the east, the Democratic Republic of the Congo and... more
        EOF
        ),
      }),
    ]
  end

  def show
    
    @name = params[:id].capitalize
    
    @country = OpenStruct.new({
      name: 'Central African Republic',
      alerts_count: 2931,
      description: (<<-EOF
        The Central African Republic (CAR) (French: République centrafricaine, pronounced: [ʁepyblik sɑ̃tʁafʁikɛn], or Centrafrique [sɑ̃tʀafʀik]; Sango Ködörösêse tî Bêafrîka), is a landlocked country in Central Africa. It borders Chad in the north, Sudan in the northeast, South Sudan in the east, the Democratic Republic of the Congo and Congo in the south, and Cameroon in the west. The CAR covers a land area of about 240,000 square miles (620,000 km2), and has an estimated population of about 4.4 million as of 2008. Bangui is the capital city.
      EOF
      ),
      last_alerts: [{:date => DateTime.new(2012, 5, 5, 16, 32), :count => 12345}] * 4,
      wikipedia_link: 'http://en.wikipedia.org/wiki/Cameroon'      
    })
    
    @brazil = OpenStruct.new({
      name: 'Brazil',
      alerts_count: 2931,
      description: (<<-EOF
        Brazil i/brəˈzɪl/ (Portuguese: Brasil, IPA: [bɾaˈziw][8]), officially the Federative Republic of Brazil[9][10] (Portuguese: República Federativa do Brasil,  listen (help·info)), is the largest country in South America. It is the world's fifth largest country, both by geographical area and by population with over 192 million people.[11][12] It is the only Portuguese-speaking country in the Americas and the largest lusophone country in the world.[11]      EOF
      ),
      last_alerts: [{:date => DateTime.new(2012, 5, 5, 16, 32), :count => 12345}] * 4,
      wikipedia_link: 'http://en.wikipedia.org/wiki/Brazil'      
    })

    @cameroon = OpenStruct.new({
      name: 'Cameroon',
      alerts_count: 2931,
      description: (<<-EOF
Cameroon, officially the Republic of Cameroon (French: République du Cameroun), is a country in west Central Africa. It is bordered by Nigeria to the west; Chad to the northeast; the Central African Republic to the east; and Equatorial Guinea, Gabon, and the Republic of the Congo to the south. Cameroon's coastline lies on the Bight of Bonny, part of the Gulf of Guinea and the Atlantic Ocean. The country is called "Africa in miniature" for its geological and cultural diversity. Natural features include beaches, deserts, mountains, rainforests, and savannas. The highest point is Mount Cameroon in the southwest, and the largest cities are Douala, Yaoundé, and Garoua. Cameroon is home to over 200 different linguistic groups. The country is well known for its native styles of music, particularly makossa and bikutsi, and for its successful national football team. French and English are the official languages.      EOF
      EOF
      ),
      last_alerts: [{:date => DateTime.new(2012, 5, 5, 16, 32), :count => 12345}] * 4,
      wikipedia_link: 'http://en.wikipedia.org/wiki/Cameroon'
    })

    @malasya = OpenStruct.new({
      name: 'Malaysia',
      alerts_count: 2931,
      description: (<<-EOF
Malaysia (i/məˈleɪʒə/ mə-lay-zhə or i/məˈleɪsiə/ mə-lay-see-ə) is a federal constitutional monarchy in Southeast Asia. It consists of thirteen states and three federal territories and has a total landmass of 329,847 square kilometres (127,350 sq mi) separated by the South China Sea into two similarly sized regions, Peninsular Malaysia and Malaysian Borneo. Land borders are shared with Thailand, Indonesia, and Brunei, and maritime borders exist with Singapore, Vietnam, and the Philippines. The capital city is Kuala Lumpur, while Putrajaya is the seat of the federal government. In 2010 the population exceeded 27.5 million, with over 20 million living on the Peninsula.
      EOF
      ),
      last_alerts: [{:date => DateTime.new(2012, 5, 5, 16, 32), :count => 12345}] * 4,
      wikipedia_link: 'http://en.wikipedia.org/wiki/Malaysia'
    })

    @india = OpenStruct.new({
      name: 'India',
      alerts_count: 2931,
      description: (<<-EOF
India (i/ˈɪndiə/), officially the Republic of India (Bhārat Gaṇarājya),[c] is a country in South Asia. It is the seventh-largest country by geographical area, the second-most populous country with over 1.2 billion people, and the most populous democracy in the world. Bounded by the Indian Ocean on the south, the Arabian Sea on the south-west, and the Bay of Bengal on the south-east, it shares land borders with Pakistan to the west;[d] China, Nepal, and Bhutan to the north-east; and Burma and Bangladesh to the east. In the Indian Ocean, India is in the vicinity of Sri Lanka and the Maldives; in addition, India's Andaman and Nicobar Islands share a maritime border with Thailand and Indonesia.
      EOF
      ),
      last_alerts: [{:date => DateTime.new(2012, 5, 5, 16, 32), :count => 12345}] * 4,
      wikipedia_link: 'http://en.wikipedia.org/wiki/India'
    })

    @indonesia = OpenStruct.new({
      name: 'Indonesia',
      alerts_count: 2931,
      description: (<<-EOF
Indonesia (i/ˌɪndəˈniːʒə/ in-də-nee-zhə or /ˌɪndoʊˈniːziə/ in-doh-nee-zee-ə), officially the Republic of Indonesia (Indonesian: Republik Indonesia Indonesian pronunciation: [rɛpʊblɪk ɪndɔnɛsɪa]), is a country in Southeast Asia and Oceania. Indonesia is an archipelago comprising approximately 17,508 islands.[5] It has 33 provinces with over 238 million people, and is the world's fourth most populous country. Indonesia is a republic, with an elected legislature and president. The nation's capital city is Jakarta. The country shares land borders with Papua New Guinea, East Timor, and Malaysia. Other neighboring countries include Singapore, Philippines, Australia, and the Indian territory of the Andaman and Nicobar Islands. Indonesia is a founding member of ASEAN and a member of the G-20 major economies. The Indonesian economy is the world's 17th largest economy by nominal GDP.      
      EOF
      ),
      last_alerts: [{:date => DateTime.new(2012, 5, 5, 16, 32), :count => 12345}] * 4,
      wikipedia_link: 'http://en.wikipedia.org/wiki/Indonesia'
    });
    
    @blog_posts = [
      OpenStruct.new({
        title: 'Kony Tracked by U.S. Forces in Central Africa',
        body: (<<-EOF
          The Central African Republic (CAR) (French: République centrafricaine) is a landlocked country in Central Africa. Sounding like this It borders Chad in the north, Sudan in the northeast, South Sudan in the east, the Democratic Republic of the Congo and... more
        EOF
        ),
      }),

      OpenStruct.new({
        title: 'U.N. Says Congo Rebels Killed Scores...',
        body: (<<-EOF
          The Central African Republic (CAR) (French: République centrafricaine) is a landlocked country in Central Africa. Sounding like this It borders Chad in the north, Sudan in the northeast, South Sudan in the east, the Democratic Republic of the Congo and... more
        EOF
        ),
      }),

      OpenStruct.new({
        title: 'Kony Tracked by U.S. Forces in Central Africa',
        body: (<<-EOF
          The Central African Republic (CAR) (French: République centrafricaine) is a landlocked country in Central Africa. Sounding like this It borders Chad in the north, Sudan in the northeast, South Sudan in the east, the Democratic Republic of the Congo and... more
        EOF
        ),
      }),
    ]
  end
end
