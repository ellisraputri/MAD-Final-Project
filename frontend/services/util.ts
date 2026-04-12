export const getMillis = (t: any) => {
    return t._seconds * 1000 + t._nanoseconds / 1e6;
}

export const estimateDistance = (motionData: number[], dt: number = 0.1) => {
  let velocity = 0;
  let position = 0;

  for (let i = 0; i < motionData.length; i++) {
    const accG = motionData[i];

    // remove gravity
    let acc = (accG - 1) * 9.81;

    // 🔥 1. NOISE FILTER (very important)
    if (Math.abs(acc) < 0.3) acc = 0;

    // integrate
    velocity += acc * dt;

    // 🔥 2. DAMPING (prevents drift explosion)
    velocity *= 0.8;

    // 🔥 3. STOP small velocity
    if (Math.abs(velocity) < 0.01) velocity = 0;

    position += velocity * dt;
  }

  return Math.abs(position*10); 
};