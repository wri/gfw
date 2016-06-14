Gfw::Application.routes.draw do

  mount JasmineRails::Engine => '/specs' if defined?(JasmineRails)

  #legacy
    # stories
    # get '/stories' => redirect("/stayinformed/crowdsourced-stories")

    # 2004-2009 era
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

    # about
    get '/about/video' => redirect("/about")
    get '/about/gfw' => redirect("/about/about-gfw")
    get '/about/partners' => redirect("/about/the-gfw-partnership")
    get '/partners' => redirect("/about/the-gfw-partnership")
    get '/about/users' => redirect("/about")
    get '/about/small_grants_fund' => redirect("/small-grants-fund")
    get '/about/testers' => redirect("/about")
    get '/getinvolved/provide-feedback' => redirect("/getinvolved")

    # terms
    get '/accept_terms' => redirect("/terms")

  # stories
  get '/stories/crowdsourcedstories' => 'stories#crowdsourcedstories'
  resources :stories

  # static
  get '/data' => redirect("sources")
  get '/sources' => 'static#data'
  get '/sources(/:section)' => 'static#data'

  get '/my_gfw/' => 'connect#index', as: 'user_index'
  get '/my_gfw/*all' => 'connect#index', as: 'user_profile'

  get '/stayinformed/crowdsourced-stories' => redirect('/stories')
  get '/stayinformed' => 'static#keep'
  get '/stayinformed(/:section)' => 'static#keep'
  get '/stayinformed-stories' => 'static#keepstories'

  get '/getinvolved/apply-to-the-small-grants-fund' => redirect('/small-grants-fund')
  get '/getinvolved' => 'static#getinvolved'
  get '/getinvolved(/:section)' => 'static#getinvolved'
  get '/feedback' => 'static#feedback'
  get '/feedback_jsonp' => 'static#feedback_jsonp'

  # about
  get '/about' => 'static#about'
  get '/about(/:section)' => 'static#about'

  # explore
  get '/explore' => 'static#explore'
  get '/explore(/:section)' => 'static#explore'


  get '/notsupportedbrowser' => 'static#old', :as => 'notsupportedbrowser'
  get '/terms' => 'static#terms'

  # map
  get '/map' => 'map#index'
  get '/map/*path' => 'map#index'
  get '/map/:zoom/:lat/:lng/:iso/:maptype(/:baselayers)' => 'map#index', :lat => /[^\/]+/, :lng => /[^\/]+/
  get '/map/:zoom/:lat/:lng/:iso/:maptype(/:baselayers/:sublayers)' => 'map#index', :lat => /[^\/]+/, :lng => /[^\/]+/
  get '/map/:zoom/:lat/:lng/:iso(/:basemap/:baselayer)' => 'map#index', :lat => /[^\/]+/, :lng => /[^\/]+/

  get '/embed/map' => 'map#embed'
  get '/embed/map/*path' => 'map#embed'
  get '/embed/map/:zoom/:lat/:lng/:iso/:maptype(/:baselayers)' => 'map#embed', :lat => /[^\/]+/, :lng => /[^\/]+/
  get '/embed/map/:zoom/:lat/:lng/:iso/:maptype(/:baselayers/:sublayers)' => 'map#embed', :lat => /[^\/]+/, :lng => /[^\/]+/
  get '/embed/map/:zoom/:lat/:lng/:iso(/:basemap/:baselayer)' => 'map#embed', :lat => /[^\/]+/, :lng => /[^\/]+/
  get '/embed/map/:zoom/:lat/:lng/:iso/:basemap/:baselayer(/:filters)' => 'map#embed', :lat => /[^\/]+/, :lng => /[^\/]+/

  # countries
  get '/countries' => 'countries#index'
  get '/country/:id' => 'countries#show', :as => 'country'

  get '/country_info/:id/:box',to: redirect('/country/%{id}#%{box}')
  # todo => validate id
  get '/country/:id/:area_id' => 'countries#show', :as => 'country_area'

  get '/countries/overview' => 'countries#overview'

  # search
  get '/search(/:query)(/:page)' => 'search#index'

  # download links
  post '/download' => 'download#create_download'

  # media
  post 'media/upload' => 'media#upload'
  get 'media/show' => 'media#show'

  # embed
  get '/embed/country/:id' => 'embed#countries_show'
  get '/embed/country_info/:id/:box' => 'embed#countries_show_info', :as => 'embed_country_box'
  get '/embed/country/:id/:area_id' => 'embed#countries_show'
  get '/embed/countries/overview' => 'embed#countries_overview'

  get '/landing' => 'landing#index'

  # sitemap
  get '/sitemap' => 'sitemap#index'
  get '/howto', to: redirect('/howto/')

  # Small Grunts Fund
  get '/small-grants-fund' => 'small_grants_fund#index'

  # robots
  get '/robots', to: redirect('/robots.txt'), format: false
  get '/robots.:format' => 'robots#index'

  root 'landing#index'

  get '/glad', to: redirect('/map/3/15.00/27.00/ALL/grayscale/umd_as_it_happens')
end
