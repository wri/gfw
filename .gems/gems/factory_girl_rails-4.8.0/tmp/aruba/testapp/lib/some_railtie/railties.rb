module SomeRailtie
  class Railtie < ::Rails::Engine

    initializer "some_railtie.factories", :after => "factory_girl.set_factory_paths" do
      FactoryGirl.definition_file_paths << File.expand_path('../factories', __FILE__)
    end
  end
end