Gfw::Application.routes.draw do
  resources :stories

  # static
  get 'sources' => 'static#data'
  get 'howto' => 'static#howto'
  get 'about' => 'static#about'
  get 'notsupportedbrowser' => 'static#old', :as => 'notsupportedbrowser'
  get 'terms' => 'static#terms'
  get 'accept_terms' => 'static#accept_terms'
  post 'accept' => 'static#accept_and_redirect'

  # map
  get 'map' => 'home#index'
  get 'map/:zoom/:lat/:lng(/:iso)' => 'home#index', :lat => /[^\/]+/, :lng => /[^\/]+/
  get 'map/:zoom/:lat/:lng/:iso(/:filters)' => 'home#index', :lat => /[^\/]+/, :lng => /[^\/]+/

  # countries
  get 'countries' => 'countries#index'
  get 'country/:id' => 'countries#show', :as => 'country'
  get 'countries/overview' => 'countries#overview'

  # media
  post 'upload' => 'media#upload'

  root 'home#index'
end
