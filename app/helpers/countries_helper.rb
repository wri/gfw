module CountriesHelper

  def map_coords
    "#{map_path}/5/#{@country['lat'].round(2)}/#{@country['lng'].round(2)}/#{@country['iso']}"
  end

  def extent_to_human(extent)
    if extent < 1000
      result = "#{number_with_delimiter(extent.round(1))}"
    elsif extent >= 1000 && extent < 1000000
      result = "#{number_with_delimiter((extent/1000).round(1))} thousand"
    else
      result = "#{number_with_delimiter((extent/1000000).round(1))} million"
    end

    return result
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