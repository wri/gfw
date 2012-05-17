Gfw::Application.routes.draw do
  resources :countries
  resources :areas, :path => :map
  root :to => 'home#index'
end
