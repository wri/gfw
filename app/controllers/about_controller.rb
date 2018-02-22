class AboutController < ApplicationController
  layout 'application_react'

  def index
    @title = 'About'
    @desc = 'Global Forest Watch (GFW) is an online platform that provides data and tools for monitoring forests. By harnessing cutting-edge technology, GFW allows anyone to access near real-time information about where and how forests are changing around the world.'
    @keywords = 'GFW, about, global forest watch, about gfw, history, staff, world resources institute, wri, about gfw commodities, about gfw fires'
  end

end
