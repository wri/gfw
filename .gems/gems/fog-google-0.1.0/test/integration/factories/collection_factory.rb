class CollectionFactory
  PREFIX = 'fog-test'

  def initialize(subject, example)
    @subject = subject
    @example = example
    @resource_counter = 0
  end

  def cleanup
    resources = @subject.all.select { |resource| resource.name.start_with? PREFIX }
    resources.each { |r| r.destroy }
    resources.each { |r| Fog.wait_for { !@subject.all.map(&:identity).include? r.identity } }
  end

  def create
    @subject.create(params)
  end

  def resource_name(base=@example, prefix=PREFIX)
    index = @resource_counter += 1
    # In prefix, convert - to _ to make sure that it doesn't get stripped by the \W strip below.
    # Then, concatenate prefix, index, and base; strip all non-alphanumerics except _;
    # convert _ to -; downcase; truncate to 62 characters; delete trailing -
    ([prefix.gsub(/-/, '_'), index, base] * "_").gsub(/\W/, '').gsub(/_/, '-').downcase[0..61].chomp('-')
  end
end
