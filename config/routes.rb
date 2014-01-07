Gfw::Application.routes.draw do
  resources :countries
  resources :areas
  resources :stories
  resources :media

  # static
  match 'about' => 'static#about'
  match 'howto' => 'static#howto'
  match 'notsupportedbrowser' => 'static#old'
  match 'sources' => 'static#sources'

  # map
  match 'map' => 'home#index'
  match 'map/:zoom/:lat/:lng(/:iso)' => 'home#index', :lat => /[^\/]+/, :lng => /[^\/]+/
  match 'map/:zoom/:lat/:lng/:iso(/:filters)' => 'home#index', :lat => /[^\/]+/, :lng => /[^\/]+/

  # countries
  match 'country/:id' => 'countries#show'

  # home
  root :to => 'home#index'
  post '/register' => 'home#register'
end
