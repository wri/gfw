require 'sinatra'

get '/' do
  "Cookie setter ready"
end

get '/set/:key/:value' do
  response.set_cookie params[:key], {:value => params[:value], :path => '/', :secure => false}
  "Setting #{params[:key]}=#{params[:value]}"
end

get '/get/:key' do
  "Got cookie #{params[:key]}=#{request.cookies[params[:key]]}"
end

get '/delete/:key' do
  response.delete_cookie params[:key], :path => '/'
  "Deleting #{params[:key]}"
end

get '/set_persistent/:key/:value' do
  response.set_cookie params[:key], {:value => params[:value], :path => '/', :expires => Time.now + 60*60*24*365}
  "Setting #{params[:key]}=#{params[:value]}"
end

get '/set_stale/:key/:value' do
  response.set_cookie params[:key], {:value => params[:value], :path => '/', :expires => Time.now}
  "Setting #{params[:key]}=#{params[:value]}"
end

get '/set_with_domain/:key/:value' do
  response.set_cookie params[:key], {:value => params[:value], :path => '/', :domain => '.lvh.me'}
  "Setting #{params[:key]}=#{params[:value]}"
end

get '/set_httponly/:key/:value' do
  response.set_cookie params[:key], {:value => params[:value], :path => '/', :httponly => true}
  "Setting httponly #{params[:key]}=#{params[:value]}"
end
