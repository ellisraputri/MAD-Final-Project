import cv2
import math
import sys
import json

VIDEO_PATH = sys.argv[1]

def calculate_angle_from_line(vx, vy):
    angle_rad = math.atan2(vx, vy)
    angle_deg = abs(math.degrees(angle_rad))
    
    if angle_deg > 90:
        angle_deg = 180 - angle_deg
    return angle_deg


cap = cv2.VideoCapture(VIDEO_PATH)
angles = []
times = []

fps = cap.get(cv2.CAP_PROP_FPS)
if fps <= 0: fps = 30

frame_count = 0

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(blur, 50, 150)

    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    if contours:
        c = max(contours, key=cv2.contourArea)

        if cv2.contourArea(c) > 1000:
            [vx, vy, x, y] = cv2.fitLine(c, cv2.DIST_L2, 0, 0.01, 0.01)
            vx, vy = float(vx), float(vy)
            angle = calculate_angle_from_line(vx, vy)
            angles.append(angle)
            times.append(frame_count / fps)

    frame_count += 1

cap.release()

result = {
    "max_bend": max(angles) if angles else None
}
print(json.dumps(result))