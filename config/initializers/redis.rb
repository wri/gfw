$redis = Redis::Namespace.new("site_point", :redis => Redis.new)
$redis._client.logger = nil
