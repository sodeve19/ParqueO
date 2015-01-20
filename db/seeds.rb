# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

parking_list = [
  [ "Parqueadero de la UPB", 2500, 2500, 6.24215, -75.591764 ],
  [ "Parqueadero público LIEPOJA S.A.S.", 2500, 18000, 6.209845, -75.573172 ],
  [ "Centro Comercial Oviedo", 0, 0, 6.198960, -75.574058 ],
  [ "Centro Comercial Santafe", 0, 0, 6.196806, -75.574616 ],
  [ "Parqueadero publico", 2000, 0, 6.209498, -75.572127 ],
  [ "Centro Comercial Rio Sur", 0, 0, 6.198918, -75.573622 ],
  [ "Centro Comercial Unicentro", 0, 0, 6.240302, -75.586703 ],
  [ "Centro Comercial San Diego", 3000, 0, 6.236322, -75.569305 ],
  [ "Centro Comercial Premium Plaza", 0, 0, 6.229155, -75.570013 ]
]

parking_list.each do |name, priceperhour, priceperday, latitude, longitude|
  ParkingGarage.create( name: name, priceperhour: priceperhour, priceperday: priceperday, latitude: latitude, longitude: longitude )
end
