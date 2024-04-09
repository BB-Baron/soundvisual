import numpy as np
import matplotlib.pyplot as plt
import pyaudio

# マイクから音声をリアルタイムで取得する設定
CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 44100

p = pyaudio.PyAudio()
stream = p.open(format=FORMAT,
                channels=CHANNELS,
                rate=RATE,
                input=True,
                frames_per_buffer=CHUNK)

# スペクトルを表示するウィンドウを作成
plt.ion()
fig, ax = plt.subplots(figsize=(10, 6))
x = np.arange(0, CHUNK)
line, = ax.plot(x, np.random.rand(CHUNK))

while True:
    data = stream.read(CHUNK)
    audio_data = np.frombuffer(data, dtype=np.int16)

    # 高速フーリエ変換 (FFT) を実行
    fft_result = np.fft.fft(audio_data)
    fft_freq = np.fft.fftfreq(len(fft_result), d=1/RATE)

    # 振幅スペクトルを計算
    amplitude_spectrum = np.abs(fft_result)

    # スペクトルを更新
    line.set_ydata(amplitude_spectrum)
    fig.canvas.draw()
    fig.canvas.flush_events()

# ストリームを閉じる
stream.stop_stream()
stream.close()
p.terminate()
