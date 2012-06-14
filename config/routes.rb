Gfw::Application.routes.draw do
  resources :countries
  resources :areas
  resources :posts
  resources :sources

  match 'blog'  => 'posts#index'
  match 'about' => 'static#about'

  match 'map'   => 'home#index'
  match 'map/:zoom/:lat/:lng(/:filters)'   => 'home#index', :lat => /[^\/]+/, :lng => /[^\/]+/

  match 'country/:id' => 'countries#show'

  match 'country/:id'   => 'countries#show'
  resources :demo

  root :to => 'home#index'
end
