Gfw::Application.routes.draw do
  resources :countries
  resources :demo
  resources :areas, :path => :map

  match 'map' => 'home#index'
  root :to => 'home#index'
end
