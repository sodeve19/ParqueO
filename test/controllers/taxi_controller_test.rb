require 'test_helper'

class TaxiControllerTest < ActionController::TestCase
  test "should get taxi_cost_estimation" do
    get :taxi_cost_estimation
    assert_response :success
  end

end
