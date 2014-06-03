module CountriesHelper

  def map_coords
    "#{map_path}/5/#{@country['lat'].round(2)}/#{@country['lng'].round(2)}/#{@country['iso']}"
  end

  def extent_to_human(extent, options = {})
    options = {format: '%n %u', shortUnit: false}.merge(options)

    if extent < 1000
      number = "#{number_with_delimiter(extent.round(0))}"
      unit = options[:shortUnit] ? "Ha" : ''
    elsif extent >= 1000 && extent < 1000000
      number = "#{number_with_delimiter((extent/1000).round(1))}"
      unit = options[:shortUnit] ? "KHa" : 'thousand'
    else
      number = "#{number_with_delimiter((extent/1000000).round(1))}"
      unit = options[:shortUnit] ? "MHa" : 'million'
    end

    string = options[:format]
    string.gsub!('%n', number)
    string.gsub!('%u', unit)

    return string
  end

  def gva_to_human(gva)
    if gva < 1000
      result = "#{number_with_delimiter(gva.round(1))} million"
    else
      result = "#{number_with_delimiter((gva/1000).round(1))} billion"
    end

    return result
  end

end