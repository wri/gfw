Gfw::Application.routes.draw do

  mount JasmineRails::Engine => '/specs' if defined?(JasmineRails)

  ########### LEGACY #############
  # about
  get '/partners' => redirect('/about')
  get '/about/small_grants_fund' => redirect('/small-grants-fund')
  get '/small-grants-fund' => redirect('/grants-and-fellowships')
  get '/small-grants-fund/*all' => redirect('/grants-and-fellowships')

  # countries
  get '/country', to: redirect('/dashboards/global')
  get '/country/embed/:widget/:adm0', to: redirect { |params, req|
    "/embed/dashboards/country/#{params[:adm0]}?widget=#{params[:widget]}&#{req.query_string}" }
  get '/country/embed/:widget/:adm0/:adm1', to: redirect { |params, req|
    "/embed/dashboards/country/#{params[:adm0]}/#{params[:adm1]}?widget=#{params[:widget]}&#{req.query_string}" }
  get '/country/embed/:widget/:adm0/:adm1/:adm2', to: redirect { |params, req|
    "/embed/dashboards/country/#{params[:adm0]}/#{params[:adm1]}/#{params[:adm2]}?widget=#{params[:widget]}&#{req.query_string}" }

  get '/embed/dashboards/country/:adm0', to: redirect { |params, req| puts req
    "/embed/widget/#{req[:widget]}/country/#{params[:adm0]}?#{req.query_string}" }
  get '/embed/dashboards/country/:adm0/:adm1', to: redirect { |params, req| puts req
    "/embed/widget/#{req[:widget]}/country/#{params[:adm0]}/#{params[:adm1]}?#{req.query_string}" }
  get '/embed/dashboards/country/:adm0/:adm1/:adm2', to: redirect { |params, req| puts req
    "/embed/widget/#{req[:widget]}/country/#{params[:adm0]}/#{params[:adm1]}/#{params[:adm2]}?#{req.query_string}" }

  get '/country/*all', to: redirect { |params, req| "/dashboards#{req.fullpath}" }
  get '/countries' => redirect('/dashboards/global')
  get '/countries/*all' => redirect('/dashboards/global')

  # howto
  get '/howto', to: redirect('/howto/')

  # data
  get '/data', to: redirect('http://data.globalforestwatch.org')

  # sources
  get '/sources' => redirect("http://data.globalforestwatch.org/")
  get '/sources/*all' => redirect("http://data.globalforestwatch.org/")

  get '/my_gfw' => redirect("/my-gfw")
  get '/my_gfw/*all' => redirect("/my-gfw")
  ########### /LEGACY #############

  ########### ACTIVE ROUTES #############
  root 'home#index'

  # map
  get '/map' => 'map#index'
  get '/map(/:type)(/:adm0)(/:adm1)(/:adm2)' => 'map#index'
  get '/map/*all' => 'map#index'
  get '/embed/map' => 'map#index'
  get '/embed/map(/:type)(/:adm0)(/:adm1)(/:adm2)' => 'map#index'
  get '/embed/map/*all' => 'map#index'

  # dashboards
  get '/dashboards' => redirect('/dashboards/global')
  get '/dashboards(/:type)(/:adm0)(/:adm1)(/:adm2)' => 'dashboards#index'
  get '/embed/widget/:slug/:type(/:adm0)(/:adm1)(/:adm2)' => 'dashboards#embed'

  # about
  get '/about' => 'about#index'
  get '/about(/:section)' => 'about#index'

  # topics
  get '/topics' => redirect('/topics/biodiversity')
  get '/topics/:tab' => 'topics#index'

  # thank you
  get '/thank-you' => 'thankyou#index'

  # my gfw
  get '/my-gfw' => 'my_gfw#index'
  get '/my-gfw/*all' => 'connect#index', as: 'user_profile'

  # stories
  get '/stories' => 'stories#index'
  get '/stories/*all' => 'stories#index'

  # Small Grunts Fund
  get '/grants-and-fellowships' => 'grants_and_fellowships#index'
  get '/grants-and-fellowships/*all' => 'grants_and_fellowships#index'

  # static #
  get '/browser-support' => 'browser_support#index'
  get '/terms' => 'terms#index'
  get '/privacy-policy' => 'privacy#index'

  # search
  get '/search(/:query)(/:page)' => 'search#index'

  # subscribe
  get '/subscribe' => 'subscribe#index'

  # media
  post 'media/upload' => 'media#upload'
  get  'media/show' => 'media#show'

  # robots
  get '/robots', to: redirect('/robots.txt'), format: false
  get '/robots.:format' => 'robots#index'

  get '/404' => 'not_found#index'
  get '/422' => 'unacceptable#index'
  get '/500' => 'internal_error#index'

  ########### /ACTIVE ROUTES #############

end
