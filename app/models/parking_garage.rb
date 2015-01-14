class ParkingGarage < ActiveRecord::Base
  reverse_geocoded_by :latitude, :longitude
  #has_and_belongs_to_many :users
end
