import numpy as np
import matplotlib.pyplot as plt
from scipy.io import wavfile

# 音声ファイルの読み込み
sample_rate, audio_data = wavfile.read("your_audio_file.wav")

# 高速フーリエ変換 (FFT) を実行
fft_result = np.fft.fft(audio_data)
fft_freq = np.fft.fftfreq(len(fft_result), d=1/sample_rate)

# 振幅スペクトルを計算
amplitude_spectrum = np.abs(fft_result)

# スペクトログラムを表示
plt.figure(figsize=(10, 6))
plt.plot(fft_freq, amplitude_spectrum)
plt.xlabel("Frequency (Hz)")
plt.ylabel("Amplitude")
plt.title("Amplitude Spectrum of Audio")
plt.grid(True)
plt.show()
