import { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";


export default function MapComponent() {
  useEffect(() => {
    console.log('Initializing map...');
    fetch('http://localhost:3000/api/mapbox-token')
      .then((res) => res.json())
      .then(({ token }) => {
        mapboxgl.accessToken = token;
        console.log('Mapbox token:', token);

        const map = new mapboxgl.Map({
          container: "map",
          style: "mapbox://styles/mapbox/streets-v12",
          center: [-73.935242, 40.73061],
          zoom: 12,
        });

        const locations = [
          {
            address: "350 5th Ave, New York, NY 10118",
            imageSrc: "https://www.esbnyc.com/sites/default/files/2025-03/ESB-DarkBlueSky.webp",
            description: "Empire State Building",
          },
          {
            address: "11 Wall St, New York, NY 10005",
            imageSrc: "https://cdn.britannica.com/53/68353-050-83DDD422/Trading-floor-New-York-Stock-Exchange-City.jpg?w=385",
            description: "New York Stock Exchange",
          },
          {
            address: "30 Rockefeller Plaza, New York, NY 10112",
            imageSrc: "https://processed-listing-and-building-images-production.s3.us-east-005.backblazeb2.com/0687872d-c6e0-4a91-8e3c-6b7307843e7a-400",
            description: "Top of the Rock",
          },
          {
            address: "Central Park, New York, NY",
            imageSrc: "https://www.parkcentralny.com/wp-content/uploads/2023/11/central_park_crop.jpg",
            description: "Central Park",
          },
          {
            address: "Brooklyn Bridge, New York, NY",
            imageSrc: "https://www.exp1.com/wp-content/uploads/sites/7/2020/06/BK-Bridge-1.jpg",
            description: "Brooklyn Bridge",
          },
        ];

        locations.forEach((loc) => {
          const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            loc.address
          )}.json?access_token=${token}`;

          fetch(url)
            .then((res) => res.json())
            .then((data) => {
              if (!data.features || data.features.length === 0) {
                console.warn("No coordinates found for", loc.address);
                return;
              }

              const [lng, lat] = data.features[0].center;
              new mapboxgl.Marker()
                .setLngLat([lng, lat])
                .setPopup(
                  new mapboxgl.Popup().setHTML(`
                    <h4>${loc.description}</h4>
                    <img src="${loc.imageSrc}" alt="${loc.description}" style="width:200px;height:auto;" />
                    <p>${loc.address}</p>
                  `)
                )
                .addTo(map);
            })
            .catch((err) =>
              console.error(`Failed to geocode ${loc.address}:`, err)
            );
        });
      })
      .catch((err) =>
        console.error("Failed to load Mapbox token or initialize map:", err)
      );
  }, []);

  return <div id="map" style={{ width: "100%", height: "500px", marginTop: "40px" }} />;
}
