Gfw::Application.routes.draw do
  resources :stories

  # terms
  post '/accept' => 'home#accept_and_redirect'

  # static
  get '/data' => redirect("sources/forest_change")
  get '/sources' => redirect('sources/forest_change')
  get '/sources(/:section)' => 'static#data'
  get '/howto' => redirect('howto/video')
  get '/howto(/:section)' => 'static#howto'
  get '/about' => redirect('about/video')
  get '/about(/:section)' => 'static#about'

  get '/notsupportedbrowser' => 'static#old', :as => 'notsupportedbrowser'
  get '/terms' => 'static#terms'
  get '/accept_terms' => 'static#accept_terms'

  # map
  get '/map' => 'home#index'
  get '/map/:zoom/:lat/:lng/:iso(/:basemap/:baselayer)' => 'home#index', :lat => /[^\/]+/, :lng => /[^\/]+/
  get '/map/:zoom/:lat/:lng/:iso/:basemap/:baselayer(/:filters)' => 'home#index', :lat => /[^\/]+/, :lng => /[^\/]+/

  # countries
  get '/countries' => 'countries#index'
  get '/country/:id' => 'countries#show', :as => 'country'
  get '/countries/overview' => 'countries#overview'
  # New country page
  get '/r/country/:id' => 'countries#show_redesign', :as =>'country_redesign'


  # media
  post 'media/upload' => 'media#upload'
  get 'media/show' => 'media#show'

  # embed
  get '/embed/country/:id' => 'embed#countries_show'
  get '/embed/countries/overview' => 'embed#countries_overview'
  get '/embed/map' => 'embed#map'
  get '/embed/map/:zoom/:lat/:lng/:iso(/:basemap/:baselayer)' => 'embed#map', :lat => /[^\/]+/, :lng => /[^\/]+/
  get '/embed/map/:zoom/:lat/:lng/:iso/:basemap/:baselayer(/:filters)' => 'embed#map', :lat => /[^\/]+/, :lng => /[^\/]+/

  root 'home#index'
end
