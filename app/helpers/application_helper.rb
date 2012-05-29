module ApplicationHelper

def snippet(code, comment = nil) 
render :partial => "demo/snippet", :locals => { :code => code, :comment => comment } 
  end
end

def color(code, name) 
  render :partial => "demo/color", :locals => { :code => code, :name => name } 
end
