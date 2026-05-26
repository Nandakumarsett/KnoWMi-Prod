/**
 * A professional geolocation wrapper that forces high accuracy.
 * Instead of taking the first immediate guess (which is often an inaccurate network/IP guess from the ISP),
 * this watches the position for a few seconds to wait for the GPS chip to acquire satellites,
 * returning the coordinates with the lowest accuracy radius (best precision).
 */
export const getAccurateLocation = (options = { timeout: 10000, maximumAge: 0, enableHighAccuracy: true }) => {
  return new Promise((resolve, reject) => {
    // Check Cache first (Valid for 2 hours)
    try {
      const cachedStr = localStorage.getItem('knowmi_location_cache');
      if (cachedStr) {
        const cached = JSON.parse(cachedStr);
        if (Date.now() - cached.timestamp < 2 * 60 * 60 * 1000) {
          return resolve(cached.position);
        }
      }
    } catch (e) {
      // Ignore cache errors
    }

    if (!navigator.geolocation) {
      return reject(new Error('Geolocation not supported'));
    }

    let watchId;
    let timeoutId;
    let bestPosition = null;

    const cleanup = () => {
      if (watchId !== undefined) navigator.geolocation.clearWatch(watchId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };

    const saveAndResolve = (position) => {
      // Ensure we only cache serializable data
      const posObj = {
        coords: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        },
        timestamp: position.timestamp || Date.now()
      };
      try {
        localStorage.setItem('knowmi_location_cache', JSON.stringify({
          position: posObj,
          timestamp: Date.now()
        }));
      } catch (e) {}
      resolve(posObj);
    };

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        // If it's the first ping or if this ping is more accurate (smaller accuracy radius)
        if (!bestPosition || position.coords.accuracy < bestPosition.coords.accuracy) {
          bestPosition = position;
        }
        
        // If accuracy is very high (under 100 meters), we don't need to wait for the timeout
        if (position.coords.accuracy <= 100) {
          cleanup();
          saveAndResolve(bestPosition);
        }
      },
      (err) => {
        // If we get an error but already found a decent position, use it. Otherwise reject.
        if (bestPosition) {
          cleanup();
          saveAndResolve(bestPosition);
        } else {
          cleanup();
          reject(err);
        }
      },
      options
    );

    // Stop watching after the timeout and resolve with the best position found so far
    timeoutId = setTimeout(() => {
      cleanup();
      if (bestPosition) {
        saveAndResolve(bestPosition);
      } else {
        reject(new Error('Geolocation timeout'));
      }
    }, options.timeout);
  });
};
