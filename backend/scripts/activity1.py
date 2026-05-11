import cv2
import numpy as np
import math
import sys
import json

def get_center(x, y, w, h):
    return int(x + w / 2), int(y + h / 2)

def distance(p1, p2):
    return math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)

def smooth(data, window=5):
    if len(data) < window:
        return np.array(data, dtype=float)
    return np.convolve(data, np.ones(window) / window, mode='valid')

VIDEO_PATH = sys.argv[1]
COLOR_MODE = 'any'

# Blob size filter — ignore detections outside this radius range (pixels)
MIN_RADIUS = 5
MAX_RADIUS = 120

# Tracker config
MAX_GAP_FRAMES = 10     # frames without detection before tracker resets
MAX_JUMP_PX   = 150     # max pixel jump between frames

# Motion analysis
SMOOTH_WINDOW           = 5
MIN_FALL_VELOCITY       = 1.5   # px/frame downward before touch counts
STOP_WINDOW             = 7     # consecutive frames to check for stop
STOP_MOVEMENT_THRESHOLD = 8     # total pixel movement across STOP_WINDOW to call "stopped"

class BallDetector:
    def __init__(self, color_mode):
        self.color_mode = color_mode
        self.bg_sub = cv2.createBackgroundSubtractorMOG2(
            history=300, varThreshold=32, detectShadows=False
        )

    def _get_mask_bg(self, frame):
        mask = self.bg_sub.apply(frame)
        # Remove shadows (gray pixels = 127)
        _, mask = cv2.threshold(mask, 200, 255, cv2.THRESH_BINARY)
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN,  kernel, iterations=2)
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel, iterations=2)
        return mask

    def detect(self, frame):
        mask = self._get_mask_bg(frame)
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        candidates = []

        for cnt in contours:
            area = cv2.contourArea(cnt)
            if area < math.pi * MIN_RADIUS**2:
                continue

            perimeter = cv2.arcLength(cnt, True)
            if perimeter == 0:
                continue

            # Circularity: 1.0 = perfect circle
            circularity = 4 * math.pi * area / (perimeter ** 2)
            if circularity < 0.1: # prevent line like object
                continue

            (x, y), radius = cv2.minEnclosingCircle(cnt)
            radius = int(radius)

            if not (MIN_RADIUS <= radius <= MAX_RADIUS):
                continue

            center = (int(x), int(y))
            candidates.append((center, radius, circularity, cnt))

        # Sort by circularity descending (most round first)
        candidates.sort(key=lambda c: c[2], reverse=True)

        return [(c[0], c[1], c[3]) for c in candidates]  # (center, radius, contour)

# =========================
# Temporal Tracker
# Nearest-neighbour matching to keep consistent ID across frames
# =========================

class BallTracker:
    def __init__(self, max_gap=MAX_GAP_FRAMES, max_jump=MAX_JUMP_PX):
        self.last_center = None
        self.miss_count  = 0
        self.max_gap     = max_gap
        self.max_jump    = max_jump

    def update(self, detections):
        """
        detections: list of (center, radius, contour)
        Returns chosen (center, radius, contour) or None
        """
        if not detections:
            self.miss_count += 1
            if self.miss_count > self.max_gap:
                self.last_center = None
            return None

        if self.last_center is None:
            # Bootstrap with first (most circular) candidate
            chosen = detections[0]
            self.last_center = chosen[0]
            self.miss_count  = 0
            return chosen

        # Filter by max jump distance
        candidates = [d for d in detections if distance(d[0], self.last_center) < self.max_jump]

        if not candidates:
            self.miss_count += 1
            if self.miss_count > self.max_gap:
                self.last_center = None
            return None

        # Pick closest to last known position
        chosen = min(candidates, key=lambda d: distance(d[0], self.last_center))
        self.last_center = chosen[0]
        self.miss_count  = 0
        return chosen


cap = cv2.VideoCapture(VIDEO_PATH)
if not cap.isOpened():
    print(json.dumps({"error": f"Cannot open video: {VIDEO_PATH}"}))
    sys.exit(1)

fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
frame_count = 0

try:
    detector = BallDetector(COLOR_MODE)
except ValueError as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)

tracker = BallTracker()
positions = []
times = []

# =========================
# Main Loop
# =========================

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    
    frame = cv2.resize(frame, (640, 360))
    blurred = cv2.GaussianBlur(frame, (7, 7), 0)

    detections = detector.detect(blurred)
    chosen = tracker.update(detections)

    if chosen:
        center, radius, contour = chosen
        positions.append(center)
        times.append(frame_count / fps)

    frame_count += 1

cap.release()

# =========================
# Validation
# =========================

if len(positions) < 10:
    print(json.dumps({
        "touch_time": None,
        "error": (
            f"Not enough detections ({len(positions)} frames). "
            "Try adjusting HSV range or switching to color mode 'any'."
        )
    }))
    sys.exit(0)

# =========================
# Touch Detection
# Requires ball to be genuinely falling before deceleration counts
# =========================

y_vals   = [p[1] for p in positions]
y_smooth = smooth(y_vals, SMOOTH_WINDOW)
t_smooth = times[:len(y_smooth)]

velocities  = np.diff(y_smooth)   # positive = moving down in image space
touch_time  = None

for i in range(1, len(velocities)):
    was_falling = velocities[i - 1] >= MIN_FALL_VELOCITY
    now_slowing = velocities[i] < velocities[i - 1]

    if was_falling and now_slowing:
        touch_time = float(t_smooth[i])
        break


result = {
    "touch_time":touch_time
}

print(json.dumps(result))