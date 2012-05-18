Gfw::Application.routes.draw do
  resources :countries
  resources :demo

  resources :areas, :path => :map
  root :to => 'home#index'
end
