module Fog
  module SakuraCloud
    module Utils
      module Request
        def request(params)
          response = parse @connection.request(params)

          response
          ## SakuraCloud API returns Japanese message.
          #  This wrapper decodes and show message to be human readble.
        rescue Excon::Errors::HTTPStatusError => e
          Fog::Logger.warning ::JSON.parse(e.response.body)['error_msg']
          raise e
        end

        private
        def parse(response)
          return response if response.body.empty?
          response.body = Fog::JSON.decode(response.body)
          response
        end
      end
    end
  end
end
