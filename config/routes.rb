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
  get '/howto/general_questions' => redirect("/howto/faqs")
  get '/howto/terminology' => redirect("/howto/faqs")
  get '/howto/data' => redirect("/howto/faqs")
  get '/howto/web_platform' => redirect("/howto/faqs")
  get '/howto/for_business' => redirect("/howto/faqs")
  get '/howto/analyze-forest-change' => redirect("/howto/analyze-and-subscribe-to-forest-change-data")
  get '/howto/subscribe-to-alerts-and-user-stories' => redirect("/howto/analyze-and-subscribe-to-forest-change-data")

  # sources
  get '/sources' => redirect("http://data.globalforestwatch.org/")
  get '/sources(/:section)' => redirect("http://data.globalforestwatch.org/")

  # stories
  get '/stayinformed/crowdsourced-stories' => redirect('/stories')
  get '/stories/crowdsourcedstories' => redirect('/stories')

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
  get '/getinvolved/provide-feedback' => redirect('/getinvolved')
  get '/feedback' => redirect("about")

  # explore
  get '/explore' , to: redirect('/developers-corner/gallery/')
  get '/explore(/:section)' , to: redirect('/developers-corner/gallery/')

  # howto
  get '/howto', to: redirect('/howto/')

  # developers corner
  get '/developers-corner', to: redirect('/developers-corner/')

  # about
  get '/partners' => redirect('/about')

  # map
  get '/glad', to: redirect('/map/3/15.00/27.00/ALL/grayscale/umd_as_it_happens')

  # country
  get '/country_info/:id/:box',to: redirect('/country/%{id}#%{box}')
  get '/country',to: redirect('/dashboards/global')
  get '/country/embed/:widget', to: redirect { |params, req| "/dashboards/embed/country?#{req.params.except!(:iso).to_query}" }
  get '/country/embed/:widget/:iso', to: redirect { |params, req| "/dashboards/embed/country/#{params[:iso]}?#{req.params.except!(:iso).to_query}" }
  get '/country/embed/:widget/:iso/:region', to: redirect { |params, req| "/dashboards/embed/country/#{params[:iso]}/#{params[:region]}?#{req.params.except!(:iso).to_query}" }
  get '/country/embed/:widget/:iso/:region/:subRegion', to: redirect { |params, req| "/dashboards/embed/country/#{params[:iso]}/#{params[:region]}/#{params[:subRegion]}?#{req.params.except!(:iso).to_query}" }
  get '/country/:iso', to: redirect { |params, req| "/dashboards/country/#{params[:iso]}?#{req.params.except!(:iso).to_query}" }
  get '/country/:iso/:region', to: redirect { |params, req| "/dashboards/country/#{params[:iso]}/#{params[:region]}?#{req.params.except!(:iso, :region).to_query}" }
  get '/country/:iso/:region/:sub_region', to: redirect { |params, req| "/dashboards/country/#{params[:iso]}/#{params[:region]}/#{params[:sub_region]}?#{req.params.except!(:iso, :region, :sub_region).to_query}" }

  # countries
  get '/countries' => redirect('/dashboards/global')
  get '/countries/*all' => redirect('/dashboards/global')
  get '/embed/countries/overview' => redirect('/dashboards/global')

  ########### /LEGACY #############

  ########### ACTIVE ROUTES #############
  root 'landing#index'

  # landing
  get '/landing' => 'landing#index'

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

  # dashboards
  get '/dashboards/embed/:type/:widget(/:iso)(/:region)(/:sub_region)' => 'dashboards#embed'
  get '/dashboards(/:type)(/:iso)(/:region)(/:sub_region)' => 'dashboards#index'

  # old country embeds
  get '/embed/country/:id' => 'embed#countries_show'
  get '/embed/country_info/:id/:box' => 'embed#countries_show_info', :as => 'embed_country_box'
  get '/embed/country/:id/:area_id' => 'embed#countries_show'

  # about
  get '/about' => 'about#index'
  get '/about/small_grants_fund' => redirect('/getinvolved/apply-to-the-small-grants-fund')
  get '/about(/:section)' => 'about#index'

  # Small Grunts Fund
  get '/small-grants-fund' => 'small_grants_fund#index'
  get '/small-grants-fund/*all' => 'small_grants_fund#index'

  # connect
  get '/my_gfw/' => 'connect#index', as: 'user_index'
  get '/my_gfw/*all' => 'connect#index', as: 'user_profile'

  # stories #
  get '/stories' => 'stories#index'
  get '/stories/new' => 'stories#index', as: 'new_story'
  get '/stories/*all' => 'stories#index'

  # static #
  get '/contribute-data' => 'static#contribute'
  get '/notsupportedbrowser' => 'static#browser_support', :as => 'notsupportedbrowser'
  get '/terms' => 'static#terms'

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

  # sitemap
  get '/sitemap' => 'sitemap#index'

  # robots
  get '/robots', to: redirect('/robots.txt'), format: false
  get '/robots.:format' => 'robots#index'

  ########### /ACTIVE ROUTES #############

end
