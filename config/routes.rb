Gfw::Application.routes.draw do
  resources :countries
  match 'map' => 'home#index'
  root :to => 'home#index'
end
