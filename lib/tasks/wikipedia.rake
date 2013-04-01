desc "Gets wikipedia description and related links for each feature"
task :import_wikipedia_data => :environment do

    require 'net/http'
    require 'uri'

    begin
        puts 'Importing data from wikipedia'
        puts '============================='
        countries = Country.countries_info
        file = File.open("wiki_file.csv", "w")

        countries.each do |country|
            wikipedia_url = URI.parse(country.wikipedia_link)
            puts ' -> Importing ' + country.name + ' wikipedia description, via ' + country.wikipedia_link

            if (country.name != 'Malaysia')
                # It breaks for Malaysia, don't know why!
                doc = Nokogiri::HTML(Net::HTTP.get_response(wikipedia_url).body)
                description = doc.css('div#mw-content-text > p')[0]
                file.puts("\""+country.iso+"\",\""+description+"\"")
            end

        end

    end

end