class Api::Feedback
  def self.add_as_tester email
    body = JSON.dump({ email: email })
    headers = { 'Content-Type' => 'application/json' }
    response = Typhoeus.post("#{ENV['GFW_API_OLD']}/feedback",
      body: body, headers: headers)

    return response.success?
  end
end
