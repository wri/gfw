Gfw::Application.routes.draw do
  resources :countries
  resources :areas
  resources :posts
  resources :sources

  match 'blog'  => 'posts#index'
  match 'about' => 'static#about'
  match 'map'   => 'home#index'

  resources :demo

  root :to => 'home#index'
end
