provider = :ecloud

Shindo.tests("Fog::Compute[:#{provider}] | authentication", [provider.to_s, "livespec"]) do
  raises(ArgumentError, "No authentication tokens supplied") do
    _service = Fog::Compute::Ecloud.new(
      :base_path => "/cloudapi/spec",
      :ecloud_username => nil,
      :ecloud_password => nil,
      :ecloud_access_key => nil,
      :ecloud_private_key => nil
    )
  end

  raises(ArgumentError, "Basic Authentication only username supplied") do
    _service = Fog::Compute::Ecloud.new(
      :base_path => "/cloudapi/spec",
      :ecloud_username => "somebody@somewhere.com",
      :ecloud_password => nil,
      :ecloud_access_key => nil,
      :ecloud_private_key => nil
    )
  end

  raises(ArgumentError, "Basic Authentication only password supplied") do
    _service = Fog::Compute::Ecloud.new(
      :base_path => "/cloudapi/spec",
      :ecloud_username => nil,
      :ecloud_password => "T3rr3m@rk",
      :ecloud_access_key => nil,
      :ecloud_private_key => nil
    )
  end

  returns(Fog::Compute::Ecloud::Organization, "Basic Authentication, valid account") do
    service = Fog::Compute::Ecloud.new(
      :base_path => "/cloudapi/spec",
      :ecloud_username => "somebody@somewhere.com",
      :ecloud_password => "T3rr3m@rk",
      :ecloud_access_key => nil,
      :ecloud_private_key => nil
    )
    foo = service.organizations(:uri => "/organizations").first
    foo.class
  end

  raises(Fog::Compute::Ecloud::ServiceError, "Basic Authentication, invalid account") do
    service = Fog::Compute::Ecloud.new(
      :base_path => "/cloudapi/spec",
      :ecloud_username => "notfound@terremark.com",
      :ecloud_password => "something",
      :ecloud_access_key => nil,
      :ecloud_private_key => nil
    )
    foo = service.organizations(:uri => "/organizations").first
    foo.class
  end

  raises(ArgumentError, "API Key Authentication only access key supplied") do
    _service = Fog::Compute::Ecloud.new(
      :base_path => "/cloudapi/spec",
      :ecloud_username => nil,
      :ecloud_password => nil,
      :ecloud_access_key => 33333333333333333333333333333333,
      :ecloud_private_key => nil
    )
  end

  raises(ArgumentError, "API Key Authentication only private key supplied") do
    _service = Fog::Compute::Ecloud.new(
      :base_path => "/cloudapi/spec",
      :ecloud_username => nil,
      :ecloud_password => nil,
      :ecloud_access_key => nil,
      :ecloud_private_key => 3333333333333333333333333333333333333333333333333333333333333333
    )
  end

  returns(Fog::Compute::Ecloud::Organization, "API Key Authentication, valid key") do
    service = Fog::Compute::Ecloud.new(
      :base_path => "/cloudapi/spec",
      :ecloud_username => nil,
      :ecloud_password => nil,
      :ecloud_access_key => 33333333333333333333333333333333,
      :ecloud_private_key => 3333333333333333333333333333333333333333333333333333333333333333
    )
    foo = service.organizations(:uri => "/organizations").first
    foo.class
  end

  raises(Fog::Compute::Ecloud::ServiceError, "API Key Authentication, invalid key") do
    service = Fog::Compute::Ecloud.new(
      :base_path => "/cloudapi/spec",
      :ecloud_username => nil,
      :ecloud_password => nil,
      :ecloud_access_key => 99999999999999999999999999999999,
      :ecloud_private_key => 9999999999999999999999999999999999999999999999999999999999999999
    )
    foo = service.organizations(:uri => "/organizations").first
    foo.class
  end
end
