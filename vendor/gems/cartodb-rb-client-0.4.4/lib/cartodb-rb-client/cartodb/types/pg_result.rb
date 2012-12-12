class PGresult
  def empty?
    to_a.empty?
  end

  def items
    to_a
  end

  def sample
    to_a.sample
  end

  def size
    to_a.size
  end
end