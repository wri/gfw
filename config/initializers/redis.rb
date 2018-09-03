$redis = Redis::Namespace.new("site_point", :redis => Redis.new)
$redis.client.logger = nil
