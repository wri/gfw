Gfw::Application.routes.draw do
  resources :countries
  resources :areas
  resources :posts
  resources :sources
  resources :stories
  resources :media

  match 'blog'  => 'posts#index'
  match 'about' => 'static#about'
  match 'old' => 'static#old'

  match 'map'   => 'home#index'
  match 'map/:zoom/:lat/:lng(/:filters)'   => 'home#index', :lat => /[^\/]+/, :lng => /[^\/]+/

  match 'country/:id'   => 'countries#show'

  resources :demo

  root :to => 'home#index'
  post '/register' => 'home#register'
end
