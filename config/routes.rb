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
  get '/country/:id(/:area_id)' => redirect {|params, request| "/countries/#{params[:id]}/#{params[:area_id]}" }
  get '/embed/country/:id' => redirect {|params, request| "/embed/country_widget/summary/#{params[:id]}" }
  get '/embed/country_info/:id/:box' => redirect {|params, request| "/embed/country_widget/#{params[:box]}/#{params[:id]}" }

  # howto
  get '/howto/video' => redirect("/howto")
  get '/howto/general_questions' => redirect("/howto/faqs")
  get '/howto/terminology' => redirect("/howto/faqs")
  get '/howto/data' => redirect("/howto/faqs")
  get '/howto/web_platform' => redirect("/howto/faqs")
  get '/howto/for_business' => redirect("/howto/faqs")
  get '/howto/analyze-forest-change' => redirect("/howto/analyze-and-subscribe-to-forest-change-data")
  get '/howto/subscribe-to-alerts-and-user-stories' => redirect("/howto/analyze-and-subscribe-to-forest-change-data")

  # about
  get '/about/video' => redirect("/about")
  get '/about/gfw' => redirect("/about/about-gfw")
  get '/about/partners' => redirect("/about/the-gfw-partnership")
  get '/partners' => redirect("/about/the-gfw-partnership")
  get '/about/users' => redirect("/about")
  get '/about/small_grants_fund' => redirect("/getinvolved/apply-to-the-small-grants-fund")
  get '/about/testers' => redirect("/about")
  get '/getinvolved/provide-feedback' => redirect("/getinvolved")

  # sources
  get '/sources' => redirect("http://data.globalforestwatch.org/")
  get '/sources(/:section)' => redirect("http://data.globalforestwatch.org/")

  # stories
  get '/stayinformed/crowdsourced-stories' => redirect('/stories')

  # stayinformed
  get '/stayinformed' => redirect("/")
  get '/stayinformed(/:section)' => redirect("/")

  # getinvolved
  get '/getinvolved' => redirect("/developers-corner")
  get '/getinvolved(/:section)' => redirect("/developers-corner")

  # static
  get '/data' => redirect("sources")
  get '/getinvolved/apply-to-the-small-grants-fund' => redirect('/small-grants-fund')
  get '/getinvolved/develop-your-own-app' => redirect('/developers-corner')

  # explore
  get '/explore' , to: redirect('/developers-corner/gallery/')
  get '/explore(/:section)' , to: redirect('/developers-corner/gallery/')

  # howto
  get '/howto', to: redirect('/howto/')

  # developers corner
  get '/developers-corner', to: redirect('/developers-corner/')

  ########### /LEGACY #############


  # stories #
  get '/stories' => 'stories#index'
  get '/stories/new' => 'stories#index', as: 'new_story'
  get '/stories/*all' => 'stories#index'


  # static #
  get '/feedback' => 'static#feedback'
  get '/feedback_jsonp' => 'static#feedback_jsonp'
  get '/contribute-data' => 'static#contribute'


  # connect
  get '/my_gfw/' => 'connect#index', as: 'user_index'
  get '/my_gfw/*all' => 'connect#index', as: 'user_profile'


  # about
  get '/about' => 'static#about'
  get '/about(/:section)' => 'static#about'


  # terms
  get '/terms' => 'static#terms'


  # not supported
  get '/notsupportedbrowser' => 'static#old', :as => 'notsupportedbrowser'


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
  get '/countries/overview' => 'countries#overview'
  get '/countries/:id' => 'countries#show', :as => 'country'
  get '/countries/:id/:area_id' => 'countries#show', :as => 'country_area'
  get '/countries_info/:id/:box',to: redirect('/countries/%{id}#%{box}')


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


  # embed
  get '/embed/countries/overview' => 'embed#countries_overview'
  get '/embed/country_widget/:box/:id' => 'countries#embed_widget', :as => 'embed_country_box'
  get '/embed/country_widget/:box/:id/:area_id' => 'countries#embed_widget', :as => 'embed_country_region_box'

  get '/landing' => 'landing#index'


  # sitemap
  get '/sitemap' => 'sitemap#index'

  # Small Grunts Fund
  get '/small-grants-fund' => 'small_grants_fund#index'

  # robots
  get '/robots', to: redirect('/robots.txt'), format: false
  get '/robots.:format' => 'robots#index'

  root 'landing#index'

  get '/glad', to: redirect('/map/3/15.00/27.00/ALL/grayscale/umd_as_it_happens')
end
