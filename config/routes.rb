Gfw::Application.routes.draw do

  mount JasmineRails::Engine => '/specs' if defined?(JasmineRails)

  ########### LEGACY #############
  get '/english' => redirect('/')
  get '/french' => redirect('/')
  get '/bahasa' => redirect('/')
  get '/english/index.htm' => redirect('/')
  get '/french/index.htm' => redirect('/')
  get '/bahasa/index.htm' => redirect('/')
  get '/english/about(/:section)' => redirect('/about')
  get '/french/about(/:section)' => redirect('/about')
  get '/bahasa/about(/:section)' => redirect('/about')
  get '/english/pdfs(/:section)' => redirect("sources")
  get '/french/pdfs(/:section)' => redirect("sources")
  get '/bahasa/pdfs(/:section)' => redirect("sources")
  get '/english(/:id)(/:id2)(/:id3)' => redirect('/countries')
  get '/french(/:id)(/:id2)(/:id3)' => redirect('/countries')
  get '/bahasa(/:id)(/:id2)(/:id3)' => redirect('/countries')
  get '/common(/:section)' => redirect("sources")
  get '/common(/:section)(/:section)' => redirect("sources")
  get '/common(/:section)(/:section)(/:section)' => redirect("sources")
  get '/assets(/:content)' => redirect('/')

  # howto
  get '/howto/video' => redirect("/howto")
  get '/howto/analyze-forest-change' => redirect("/howto/analyze-and-subscribe-to-forest-change-data")
  get '/howto/subscribe-to-alerts-and-user-stories' => redirect("/howto/analyze-and-subscribe-to-forest-change-data")
  get '/howto/*all' => redirect("/howto/faqs")

  # sources
  get '/sources' => redirect("http://data.globalforestwatch.org/")
  get '/sources/*all' => redirect("http://data.globalforestwatch.org/")

  # stayinformed
  get '/stayinformed' => redirect("/")
  get '/stayinformed(/:section)' => redirect("/")

  # getinvolved
  get '/getinvolved' => redirect("/developers-corner")
  get '/getinvolved(/:section)' => redirect("/developers-corner")
  get '/getinvolved/apply-to-the-small-grants-fund' => redirect('/small-grants-fund')
  get '/getinvolved/develop-your-own-app' => redirect('/developers-corner')
  get '/getinvolved/provide-feedback' => redirect('/getinvolved')

  # static
  get '/feedback' => redirect("about")

  # explore
  get '/explore' , to: redirect('/developers-corner/gallery/')
  get '/explore(/:section)' , to: redirect('/developers-corner/gallery/')

  # developers corner
  get '/developers-corner', to: redirect('/developers-corner/')

  # about
  get '/partners' => redirect('/about')
  get '/about/small_grants_fund' => redirect('/small-grants-fund')
  get '/small-grants-fund' => redirect('/grants-and-fellowships')
  get '/small-grants-fund/*all' => redirect('/grants-and-fellowships')

  # map
  get '/glad', to: redirect('/map/3/15.00/27.00/ALL/grayscale/umd_as_it_happens')

  # country
  get '/country', to: redirect('/dashboards/global')
  get '/country/embed/:widget/:adm0', to: redirect { |params, req|
    "/embed/dashboards/country/#{params[:adm0]}?widget=#{params[:widget]}&#{req.query_string}" }
  get '/country/embed/:widget/:adm0/:adm1', to: redirect { |params, req|
    "/embed/dashboards/country/#{params[:adm0]}/#{params[:adm1]}?widget=#{params[:widget]}&#{req.query_string}" }
  get '/country/embed/:widget/:adm0/:adm1/:adm2', to: redirect { |params, req|
    "/embed/dashboards/country/#{params[:adm0]}/#{params[:adm1]}/#{params[:adm2]}?widget=#{params[:widget]}&#{req.query_string}" }
  get '/country/*all', to: redirect { |params, req| "/dashboards#{req.fullpath}" }

  # countries
  get '/countries' => redirect('/dashboards/global')
  get '/countries/*all' => redirect('/dashboards/global')

  # howto
  get '/howto', to: redirect('/howto/')

  # data
  get '/data', to: redirect('http://data.globalforestwatch.org')

  # old map
  get '/v1/map' => 'map#index'
  get '/v1/map/*all' => 'map#index'
  get '/v1/embed/map' => 'map#embed'
  get '/v1/embed/map/*all' => 'map#embed'

  ########### /LEGACY #############

  ########### ACTIVE ROUTES #############
  root 'landing#index'

  # landing
  get '/landing' => 'landing#index'

  # map
  get '/map' => 'map_v2#index'
  get '/map(/:type)(/:adm0)(/:adm1)(/:adm2)' => 'map_v2#index'
  get '/map/*all' => 'map_v2#index'
  get '/embed/map' => 'map_v2#index'
  get '/embed/map(/:type)(/:adm0)(/:adm1)(/:adm2)' => 'map_v2#index'
  get '/embed/map/*all' => 'map_v2#index'

  # dashboards
  get '/dashboards' => redirect('/dashboards/global')
  get '/dashboards(/:type)(/:adm0)(/:adm1)(/:adm2)' => 'dashboards#index'
  get '/embed/dashboards/:type(/:adm0)(/:adm1)(/:adm2)' => 'dashboards#embed'

  # about
  get '/about' => 'about#index'
  get '/about(/:section)' => 'about#index'

  # topics
  get '/topics' => redirect('/topics/biodiversity')
  get '/topics/:tab' => 'topics#index'

  # thank you
  get '/thank-you' => 'thankyou#index'

  # Small Grunts Fund
  get '/grants-and-fellowships' => 'grants_and_fellowships#index'
  get '/grants-and-fellowships/*all' => 'grants_and_fellowships#index'

  # connect
  get '/my_gfw/' => 'connect#index', as: 'user_index'
  get '/my_gfw/*all' => 'connect#index', as: 'user_profile'

  # static #
  get '/notsupportedbrowser' => 'static#browser_support', :as => 'notsupportedbrowser'
  get '/terms' => 'static#terms'
  get '/privacy-policy' => 'static#privacy'

  # search
  get '/search(/:query)(/:page)' => 'search#index'

  # download links
  post '/download' => 'download#create_download'

  # media
  post 'media/upload' => 'media#upload'
  get  'media/show' => 'media#show'

  # data
  post 'data/upload' => 'data#upload'
  get  'data/show' => 'data#show'

  #cache
  get '/cache/keys' => 'cache#keys'
  post '/cache/add' => 'cache#add'
  get '/cache/*id' => 'cache#index'

  # sitemap
  get '/sitemap' => 'sitemap#index'

  # robots
  get '/robots', to: redirect('/robots.txt'), format: false
  get '/robots.:format' => 'robots#index'

  ########### /ACTIVE ROUTES #############

end
