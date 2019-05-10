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
  ########### /LEGACY #############

  ########### ACTIVE ROUTES #############
  root 'landing#index'

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
  get '/embed/dashboards/:type(/:adm0)(/:adm1)(/:adm2)' => 'dashboards#embed'

  # about
  get '/about' => 'about#index'
  get '/about(/:section)' => 'about#index'

  # topics
  get '/topics' => redirect('/topics/biodiversity')
  get '/topics/:tab' => 'topics#index'

  # thank you
  get '/thank-you' => 'thankyou#index'

  # stories
  get '/stories' => 'stories#index'
  get '/stories/*all' => 'stories#index'

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

  # media
  post 'media/upload' => 'media#upload'
  get  'media/show' => 'media#show'

  #cache
  get '/cache/keys' => 'cache#keys'
  post '/cache/add' => 'cache#add'
  get '/cache/*id' => 'cache#index'

  # robots
  get '/robots', to: redirect('/robots.txt'), format: false
  get '/robots.:format' => 'robots#index'

  ########### /ACTIVE ROUTES #############

end
