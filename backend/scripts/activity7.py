import librosa
import numpy as np
from scipy.signal import find_peaks
import matplotlib.pyplot as plt
import sys
import json

AUDIO_PATH = sys.argv[1]
y, sr = librosa.load(AUDIO_PATH, sr=None)

frame_size = 1024
hop_length = 256
amplitude_envelope = []

for i in range(0, len(y), hop_length):
    frame = y[i:i+frame_size]
    amplitude_envelope.append(max(frame))

amplitude_envelope = np.array(amplitude_envelope)

window_size = 10
smooth = np.convolve(amplitude_envelope, np.ones(window_size)/window_size, mode='same')

peaks, _ = find_peaks(
    smooth,
    distance=sr / hop_length,
    prominence=0.02
)

duration_sec = len(y) / sr
breath_count = len(peaks)

bpm = (breath_count / duration_sec) * 60

# plt.plot(smooth)
# plt.plot(peaks, smooth[peaks], "rx")
# plt.title("Breathing Detection")
# plt.show()

smooth_list = smooth.tolist()
peaks_list = peaks.tolist()
peak_values = smooth[peaks].tolist()

times = np.arange(len(smooth)) * (hop_length / sr)
times_list = times.tolist()


result = {
    "breath_count": breath_count,
    "bpm": bpm,
    "times": times_list,
    "smooth": smooth_list,
    "peaks": peaks_list,
    "peak_values": peak_values
}

print(json.dumps(result))