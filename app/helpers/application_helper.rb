module ApplicationHelper


  def controller?(*controller)
    controller.include?(params[:controller])
  end

  def action?(*action)
    action.include?(params[:action])
  end

  # assets/stylesheets/countries.css
  def controller_stylesheet_link_tag
    stylesheet = "#{params[:controller]}.css"

    unless Rails.application.assets.find_asset(stylesheet).nil?
      stylesheet_link_tag stylesheet
    end
  end

  # assets/stylesheets/countries.js
  def controller_javascript_include_tag
    javascript = "#{params[:controller]}.js"

    unless Rails.application.assets.find_asset(javascript).nil?
      javascript_include_tag javascript
    end
  end

end
