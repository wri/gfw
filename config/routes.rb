Gfw::Application.routes.draw do
  resources :countries
  resources :demo
  resources :areas
  match 'map' => 'home#index'
  root :to => 'home#index'
end
