/**
 * A professional geolocation wrapper that forces high accuracy.
 * Instead of taking the first immediate guess (which is often an inaccurate network/IP guess from the ISP),
 * this watches the position for a few seconds to wait for the GPS chip to acquire satellites,
 * returning the coordinates with the lowest accuracy radius (best precision).
 */
export const getAccurateLocation = (options = { timeout: 10000, maximumAge: 0, enableHighAccuracy: true }) => {
  return new Promise((resolve, reject) => {
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

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        // If it's the first ping or if this ping is more accurate (smaller accuracy radius)
        if (!bestPosition || position.coords.accuracy < bestPosition.coords.accuracy) {
          bestPosition = position;
        }
        
        // If accuracy is very high (under 100 meters), we don't need to wait for the timeout
        if (position.coords.accuracy <= 100) {
          cleanup();
          resolve(bestPosition);
        }
      },
      (err) => {
        // If we get an error but already found a decent position, use it. Otherwise reject.
        if (bestPosition) {
          cleanup();
          resolve(bestPosition);
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
        resolve(bestPosition);
      } else {
        reject(new Error('Geolocation timeout'));
      }
    }, options.timeout);
  });
};
