Gfw::Application.routes.draw do
  resources :stories

  # terms
  post 'accept' => 'home#accept_and_redirect'

  # static
  get 'sources' => 'static#data'
  get 'howto' => 'static#howto'
  get 'about' => 'static#about'
  get 'notsupportedbrowser' => 'static#old', :as => 'notsupportedbrowser'
  get 'terms' => 'static#terms'

  # map
  get 'map' => 'home#index'
  get 'map/:zoom/:lat/:lng(/:iso)' => 'home#index', :lat => /[^\/]+/, :lng => /[^\/]+/
  get 'map/:zoom/:lat/:lng/:iso(/:filters)' => 'home#index', :lat => /[^\/]+/, :lng => /[^\/]+/

  # countries
  get 'countries' => 'countries#index'
  get 'country/:id' => 'countries#show', :as => 'country'
  get 'countries/overview' => 'countries#overview'

  # media
  post 'media/upload' => 'media#upload'
  get 'media/show' => 'media#show'

  # embed
  get 'embed/country/:id' => 'embed#show'
  get 'embed/countries/overview' => 'embed#overview'

  root 'home#index'
end
