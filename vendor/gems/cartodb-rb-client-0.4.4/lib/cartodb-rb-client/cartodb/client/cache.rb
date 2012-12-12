module CartoDB
  module Client
    class Cache < Hash

      def get(key)
        self[key]
      end

      def set(key, object, timeout = 0)
        self[key] = object
      end
    end
  end
end
