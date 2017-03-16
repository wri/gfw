# Changelog

## 0.10.0

- Feature: `options[:verify_mode]` to set SSL verification mode. - [Marv Cool](https://github.com/MrMarvin) [#24](https://github.com/waterlink/rack-reverse-proxy/pull/24) and [#25](https://github.com/waterlink/rack-reverse-proxy/pull/25)

## 0.9.1

- Enhancement: Remove `Status` key from response headers as per Rack protocol (see [rack/lint](https://github.com/rack/rack/blob/master/lib/rack/lint.rb#L639)) - [Jan Raasch](https://github.com/janraasch) [#7](https://github.com/waterlink/rack-reverse-proxy/pull/7)

## 0.9.0

- Bugfix: Timeout option matches the documentation - [Paul Hepworth](https://github.com/peppyheppy)
- Ruby 1.8 compatibility - [anujdas](https://github.com/anujdas)
- Bugfix: Omit port in host header for default ports (80, 443), so that it doesn't break some web servers, like "Apache Coyote" - [Peter Suschlik](https://github.com/splattael)
- Bugfix: Don't drop source request's port in response's location header - [Eric Koslow](https://github.com/ekosz)
- Bugfix: Capitalize headers correctly to prevent duplicate headers when used together with other proxies - [Eric Koslow](https://github.com/ekosz)
- Bugfix: Normalize headers from HttpStreamingResponse in order not to break other middlewares - [Jan Raasch](https://github.com/janraasch)
