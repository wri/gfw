#encoding: UTF-8
class CountriesController < ApplicationController
  
  def show
    country_info = Country.country_info(params[:id])

    attrs = {}

    Country.api_attributes.each do |attr|
      attrs[attr.to_sym] = country_info[0].send(attr)
    end

    attrs[:coords] = "#{country_info[0].lat.to_s}, #{country_info[0].lon.to_s}"

    attrs[:last_alerts] = Alert.alerts_per_month_per_country(country_info[0].iso)

    @country = OpenStruct.new(attrs)

    @featured = Story.first_three_featured
  end

end
