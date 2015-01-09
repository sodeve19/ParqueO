class ParkingGaragesController < ApplicationController
  before_action :set_parking_garage, only: [:show, :edit, :update, :destroy]

  # GET /parking_garages
  # GET /parking_garages.json
  def index
    @parking_garages = ParkingGarage.all
  end

  # GET /parking_garages/1
  # GET /parking_garages/1.json
  def show
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
    end
end
