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

    # howto
    get '/howto/video' => redirect("/howto")
    get '/howto/general_questions' => redirect("/howto/faqs")
    get '/howto/terminology' => redirect("/howto/faqs")
    get '/howto/data' => redirect("/howto/faqs")
    get '/howto/web_platform' => redirect("/howto/faqs")
    get '/howto/for_business' => redirect("/howto/faqs")

    # about
    get '/about/video' => redirect("/about")
    get '/about/gfw' => redirect("/about/about-gfw")
    get '/about/partners' => redirect("/about/the-gfw-partnership")
    get '/partners' => redirect("/about/the-gfw-partnership")
    get '/about/users' => redirect("/about")
    get '/about/small_grants_fund' => redirect("/getinvolved/apply-to-the-small-grants-fund")
    get '/about/testers' => redirect("/about")

  resources :stories

  # terms
  post '/accept' => 'home#accept_and_redirect'

  # static
  get '/data' => redirect("sources")
  get '/sources' => 'static#data'
  get '/sources(/:section)' => 'static#data'

  # get '/stayinformed' => redirect('stayinformed/crowdsourced-stories')
  get '/stayinformed' => 'static#keep'
  get '/stayinformed(/:section)' => 'static#keep'
  get '/stayinformed-stories' => 'static#keepstories'

  get '/getinvolved' => 'static#getinvolved'
  get '/getinvolved(/:section)' => 'static#getinvolved'
  get '/feedback' => 'static#feedback'

  # howto
  get '/howto' => 'static#howto'
  get '/howto(/:section)' => 'static#howto'

  # about
  get '/about' => 'static#about'
  get '/about(/:section)' => 'static#about'

  # explore
  get '/explore' => 'static#explore'
  get '/explore(/:section)' => 'static#explore'


  get '/notsupportedbrowser' => 'static#old', :as => 'notsupportedbrowser'
  get '/terms' => 'static#terms'
  get '/accept_terms' => 'static#accept_terms'

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

  post '/country/:id/download' => 'countries#create_download'
  get '/country/:id/download' => 'countries#download', :as => 'country_download'

  get '/country_info/:id/:box',to: redirect('/country/%{id}#%{box}')
  # todo => validate id
  get '/country/:id/:area_id' => 'countries#show', :as => 'country_area'

  get '/countries/overview' => 'countries#overview'

  # search
  get '/search(/:query)(/:page)' => 'search#index'


  # media
  post 'media/upload' => 'media#upload'
  get 'media/show' => 'media#show'

  # embed
  get '/embed/country/:id' => 'embed#countries_show'
  get '/embed/country_info/:id/:box' => 'embed#countries_show_info', :as => 'embed_country_box'
  get '/embed/country/:id/:area_id' => 'embed#countries_show'
  get '/embed/countries/overview' => 'embed#countries_overview'

  get '/landing' => 'landing#index'


  # robots
  get '/robots', to: redirect('/robots.txt'), format: false
  get '/robots.:format' => 'robots#index'

  root 'landing#index'




end
