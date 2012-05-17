module CapybaraHelpers
  def peich
    save_and_open_page
  end
end

RSpec.configure {|config| config.include CapybaraHelpers}
