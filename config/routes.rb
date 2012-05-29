Gfw::Application.routes.draw do
  resources :countries
  resources :areas
  resources :posts

  match 'blog' => 'posts#index'
  match 'map'  => 'home#index'

  resources :demo

  root :to => 'home#index'
end
