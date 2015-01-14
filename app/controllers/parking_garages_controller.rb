class ParkingGaragesController < ApplicationController
  before_action :set_parking_garage, only: [:show, :edit, :update, :destroy]

  # GET /parking_garages
  # GET /parking_garages.json
  def index
    # 6.215725, -75.596976 LEJOS  
    # 6.209475, -75.571580 CERCA
    if Rails.env.development?
      location = [6.209475, -75.571580]
      #@parking_garages = ParkingGarage.all
    else
      user_location = request.location
      location = [user_location.latitude, user_location.longitude]
    end
    @parking_garages = ParkingGarage.near(location, 1, :units => :km)
    # @hash = Gmaps4rails.build_markers(@users) do |user, marker|
    #   marker.lat user.latitude
    #   marker.lng user.longitude
    # end
    
    # if params[:search].present?
    #   @locations = Location.near(params[:search], 50, :order => :distance)
    # else
    #   @locations = Location.all
    # end
  end

  # GET /parking_garages/1
  # GET /parking_garages/1.json
  def show
    @parking_garage = ParkingGarage.find(params[:id])
  end

  # GET /parking_garages/new
  def new
    @parking_garage = ParkingGarage.new
  end

  # GET /parking_garages/1/edit
  def edit
  end

  # POST /parking_garages
  # POST /parking_garages.json
  def create
    @parking_garage = ParkingGarage.new(parking_garage_params)

    respond_to do |format|
      if @parking_garage.save
        format.html { redirect_to @parking_garage, notice: 'Parking garage was successfully created.' }
        format.json { render :show, status: :created, location: @parking_garage }
      else
        format.html { render :new }
        format.json { render json: @parking_garage.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /parking_garages/1
  # PATCH/PUT /parking_garages/1.json
  def update
    respond_to do |format|
      if @parking_garage.update(parking_garage_params)
        format.html { redirect_to @parking_garage, notice: 'Parking garage was successfully updated.' }
        format.json { render :show, status: :ok, location: @parking_garage }
      else
        format.html { render :edit }
        format.json { render json: @parking_garage.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /parking_garages/1
  # DELETE /parking_garages/1.json
  def destroy
    @parking_garage.destroy
    respond_to do |format|
      format.html { redirect_to parking_garages_url, notice: 'Parking garage was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_parking_garage
      @parking_garage = ParkingGarage.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def parking_garage_params
      params[:parking_garage]
      params.require(:parking_garage).permit(:latitude,:longitude,:priceperhour,:priceperday)
    end
end
