class AddLatAndLongToParkingGarages < ActiveRecord::Migration
  def change
    add_column :parking_garages, :latitude, :float
    add_column :parking_garages, :longitude, :float
  end
end
