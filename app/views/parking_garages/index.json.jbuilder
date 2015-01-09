json.array!(@parking_garages) do |parking_garage|
  json.extract! parking_garage, :id
  json.url parking_garage_url(parking_garage, format: :json)
end
