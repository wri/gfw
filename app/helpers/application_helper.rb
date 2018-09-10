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

  def javascript_entrypoint_pack_tag(*names, **options)
    javascript_include_tag(*sources_from_pack_manifest_entrypoints(names, type: :javascript), **options)
  end

  def stylesheet_entrypoint_pack_tag(*names, **options)
    unless Webpacker.dev_server.running? && Webpacker.dev_server.hot_module_replacing?
      stylesheet_link_tag(*sources_from_pack_manifest_entrypoints(names, type: :stylesheet), **options)
    end
  end

  private

  def sources_from_pack_manifest_entrypoints(names, type:)
    names.map do |name|
      Webpacker.manifest.lookup!('entrypoints')[name][manifest_type(type)]
    end.flatten
  end

  def manifest_type(type)
    case type
    when :javascript then 'js'
    when :stylesheet then 'css'
    else type.to_s
    end
  end

end
