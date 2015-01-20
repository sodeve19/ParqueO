json.array!(@parking_garages) do |parking_garage|
  json.extract! parking_garage, :id
  json.extract! parking_garage, :latitude
  json.extract! parking_garage, :longitude
  json.extract! parking_garage, :name
  json.url parking_garage_url(parking_garage, format: :json)
end
