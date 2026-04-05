import cv2
import numpy as np
import math
from ultralytics import YOLO
import sys
import json

def get_center(box):
    x1, y1, x2, y2 = box
    return int((x1 + x2) / 2), int((y1 + y2) / 2)

def distance(p1, p2):
    return math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)

def smooth(data, window=5):
    if len(data) < window:
        return data
    return np.convolve(data, np.ones(window)/window, mode='valid')

# VIDEO_PATH = "video1.mp4"
VIDEO_PATH = sys.argv[1]
MODEL_PATH = sys.argv[2]  
TARGET_CLASS = None

MOVEMENT_THRESHOLD = 2      # pixels
STOP_WINDOW = 5             # frames
SMOOTH_WINDOW = 5

model = YOLO(MODEL_PATH)
cap = cv2.VideoCapture(VIDEO_PATH)
fps = cap.get(cv2.CAP_PROP_FPS)

positions = []
times = []
frame_count = 0

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    results = model(frame, verbose=False)
    detected_center = None

    for r in results:
        for box, cls in zip(r.boxes.xyxy, r.boxes.cls):
            class_name = model.names[int(cls)]

            if (class_name != 'bench' and class_name != 'dining table'):
                x1, y1, x2, y2 = map(int, box)
                detected_center = get_center((x1, y1, x2, y2))

                # Draw detection (optional)
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0,255,0), 2)
                cv2.circle(frame, detected_center, 5, (0,0,255), -1)
                break
        if detected_center:
            break

    if detected_center:
        positions.append(detected_center)
        times.append(frame_count / fps)

    frame_count += 1

cap.release()
cv2.destroyAllWindows()

if len(positions) < 10:
    print(json.dumps({
        "touch_time": None,
        "stop_time": None,
        "error": "Not enough detections"
    }))
    sys.exit(0)

x_vals = [p[0] for p in positions]
y_vals = [p[1] for p in positions]

y_smooth = smooth(y_vals, SMOOTH_WINDOW)
t_smooth = times[:len(y_smooth)]

touch_time = None

for i in range(1, len(y_smooth)):
    prev_y = y_smooth[i-1]
    curr_y = y_smooth[i]

    if curr_y >= prev_y:
        touch_time = t_smooth[i]
        break

stop_time = None

for i in range(STOP_WINDOW, len(positions)):
    movement = 0
    for j in range(i - STOP_WINDOW, i):
        movement += distance(positions[j], positions[j+1])

    if movement < MOVEMENT_THRESHOLD:
        stop_time = times[i]
        break


result = {
    "touch_time": touch_time,
    "stop_time": stop_time
}

print(json.dumps(result))