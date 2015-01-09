class CreateParkingGarages < ActiveRecord::Migration
  def change
    create_table :parking_garages do |t|

      t.timestamps null: false
    end
  end
end
