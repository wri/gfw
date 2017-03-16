module StockStorageResponses
  def authorized_response
    {
      :status => 200,
      :body => "Authenticated",
      :headers => {
        "X-Storage-Url" => "https://orbit.brightbox.com/v1/acc-12345",
        "X-Storage-Token" => "abcdefghijklmnopqrstuvwxyz1234567890",
        "X-Auth-Token" => "abcdefghijklmnopqrstuvwxyz1234567890",
        "Content-Type" => "text/plain"
      }
    }
  end

  def unauthorized_response
    {
      :status => 401,
      :body => "<html><h1>Unauthorized</h1><p>This server could not verify that you are authorized to access the document you requested.</p></html>",
      :headers => {
        "Content-Length" => 131,
        "Content-Type" => "text/html; charset=UTF-8"
      }
    }
  end

  def bad_url_response
    {
      :status => 412,
      :body => "Bad URL",
      :headers => {
        "Content-Length" => 7,
        "Content-Type" => "text/html; charset=UTF-8"
      }
    }
  end
end
