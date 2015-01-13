class AddPropertiesToParkingGarage < ActiveRecord::Migration
  def change
    add_column :parking_garages, :priceperhour, :integer
    add_column :parking_garages, :priceperday, :integer
    add_column :parking_garages, :location, :string
    add_column :parking_garages, :name, :string
    add_column :parking_garages, :address, :string
  end
end
