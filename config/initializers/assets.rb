# frozen_string_literal: true
# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path
# Rails.application.config.assets.paths << Emoji.images_path

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
Rails.application.config.assets.precompile += %w(stories.js countries.js static.js landing.js map.js embed_countries.js stories.css countries.css static.css landing.css map.css)

Rails.application.config.assets.precompile += %w( connect.js static-pages.js )

# Require JS
# config.requirejs.loader = :almond
Rails.application.config.requirejs.logical_path_patterns += [/\.handlebars$/]
Rails.application.config.requirejs.logical_path_patterns += [/\.hbs$/]
Rails.application.config.requirejs.logical_path_patterns += [/\.cartocss$/]
