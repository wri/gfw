require "webmock/minitest"

module SupportsResourceLocking
  def self.included(base)
    base.class_eval do
      let(:collection_name) { subject.collection_name }

      def test_responds_to_locked
        assert_respond_to subject, :locked?
      end

      def test_responds_to_lock
        assert_respond_to subject, :lock!
      end

      def test_lock_makes_request
        skip if RUBY_VERSION < "1.9"

        subject.id = "tst-12345"

        stub_request(:put, "http://localhost/1.0/#{collection_name}/tst-12345/lock_resource").
          with(:query => hash_including(:account_id)).
          to_return(:status => 200, :body => "{}", :headers => {})

        subject.lock!
      end

      def test_responds_to_unlock
        assert_respond_to subject, :unlock!
      end

      def test_unlock_makes_request
        skip if RUBY_VERSION < "1.9"

        subject.id = "tst-12345"

        stub_request(:put, "http://localhost/1.0/#{collection_name}/tst-12345/unlock_resource").
          with(:query => hash_including(:account_id)).
          to_return(:status => 200, :body => "{}", :headers => {})

        subject.unlock!
      end
    end
  end
end
