# coding: utf-8

module Fog
  module SakuraCloud
    class Script
      class Real
        def create_note(options)
          body = {
            "Note" => {
              "Name" => options[:name],
              "Content" => options[:content]
            }
          }

          request(
            :headers => {
              'Authorization' => "Basic #{@auth_encode}"
            },
            :expects  => 201,
            :method => 'POST',
            :path => "#{Fog::SakuraCloud.build_endpoint(@api_zone)}/note",
            :body => Fog::JSON.encode(body)
          )
        end
      end # Real

      class Mock
        def create_note(options)
          response = Excon::Response.new
          response.status = 201
          response.body = {
            "Note"=>
            {"ID"=>"112700759852",
             "Name"=>"foobar",
             "Class"=>"shell",
             "Scope"=>"user",
             "Content"=>"#!/bin/bash",
             "Description"=>"",
             "Remark"=>nil,
             "Availability"=>"available",
             "CreatedAt"=>"2015-09-05T20:32:12+09:00",
             "ModifiedAt"=>"2015-09-05T20:32:12+09:00",
             "Icon"=>nil,
             "Tags"=>[]},
            "Success"=>true,
            "is_ok"=>true}
          response
        end
      end
    end
  end
end
