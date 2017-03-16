class Hash
  def symbolize_keys!
    keys.each do |key|
      self[key.to_sym] = delete(key) if key.respond_to?(:to_sym)
    end
    self
  end
end
