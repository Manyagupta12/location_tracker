let watchId;
let userLocation = { latitude: 0, longitude: 0 };

function startTracking() {
    const distanceInput = document.getElementById("distanceInput").value;
    const distanceThreshold = parseFloat(distanceInput);

    if (isNaN(distanceThreshold) || distanceThreshold <= 0) {
        alert("Please enter a valid distance.");
        return;
    }

    if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(
            (position) => {
                userLocation.latitude = position.coords.latitude;
                userLocation.longitude = position.coords.longitude;

                // Update status
                document.getElementById("status").innerText = 
                    `Current Location: Latitude: ${userLocation.latitude}, Longitude: ${userLocation.longitude}`;

                // Check distance
                checkDistance(distanceThreshold);
            },
            (error) => {
                console.error("Error getting location: ", error);
                alert("Unable to retrieve your location.");
            },
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 5000,
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function checkDistance(threshold) {
    const initialLocation = { latitude: 0, longitude: 0 }; // Set this to your initial location

    const distance = calculateDistance(
        initialLocation.latitude,
        initialLocation.longitude,
        userLocation.latitude,
        userLocation.longitude
    );

    if (distance > threshold) {
        alert(`Alert! You have moved beyond ${threshold} meters from the starting point.`);
    }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const toRad = (value) => (value * Math.PI) / 180;

    const R = 6371e3; // Radius of the Earth in meters
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

document.getElementById("startTracking").addEventListener("click", startTracking);
