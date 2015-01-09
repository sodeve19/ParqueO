require 'test_helper'

class ParkingGaragesControllerTest < ActionController::TestCase
  setup do
    @parking_garage = parking_garages(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:parking_garages)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create parking_garage" do
    assert_difference('ParkingGarage.count') do
      post :create, parking_garage: {  }
    end

    assert_redirected_to parking_garage_path(assigns(:parking_garage))
  end

  test "should show parking_garage" do
    get :show, id: @parking_garage
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @parking_garage
    assert_response :success
  end

  test "should update parking_garage" do
    patch :update, id: @parking_garage, parking_garage: {  }
    assert_redirected_to parking_garage_path(assigns(:parking_garage))
  end

  test "should destroy parking_garage" do
    assert_difference('ParkingGarage.count', -1) do
      delete :destroy, id: @parking_garage
    end

    assert_redirected_to parking_garages_path
  end
end
