module ApplicationHelper

def snippet(code, comment = nil) 
render :partial => "demo/snippet", :locals => { :code => code, :comment => comment } 
  end
end
