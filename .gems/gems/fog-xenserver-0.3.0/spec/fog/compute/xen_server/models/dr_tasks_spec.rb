require 'minitest_helper'

describe Fog::Compute::XenServer::Models::DrTasks do
  let(:dr_tasks_class) { Fog::Compute::XenServer::Models::DrTasks }

  it 'should be a collection of DrTasks' do
    dr_tasks_class.model.must_equal(Fog::Compute::XenServer::Models::DrTask)
  end
end