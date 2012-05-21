Gfw::Application.routes.draw do
  resources :countries
  resources :demo
  match 'map' => 'home#index'
  root :to => 'home#index'
end
