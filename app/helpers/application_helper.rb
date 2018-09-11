module ApplicationHelper

  def controller?(*controller)
    controller.include?(params[:controller])
  end

  def action?(*action)
    action.include?(params[:action])
  end

  # webpacker by default will only append your entry point .js to the head
  # in order to leverage code splitting of different entry points we need to parse the manifest
  # this helper gets all entry points from the manifest and adds to the dom (includes codesplit npm modules)
  def javascript_entrypoint_pack_tag(*names, **options)
    javascript_include_tag(*sources_from_pack_manifest_entrypoints(names, type: :javascript), **options)
  end

  # we also need only for production css files
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
