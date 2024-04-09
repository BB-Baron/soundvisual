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
x = np.linspace(0, RATE / 2, CHUNK)  # 横軸を0からサンプリングレートの半分までに修正
line, = ax.plot(x, np.random.rand(CHUNK))

# 軸の設定
ax.set_xlim(0, RATE / 2)  # 横軸は0からサンプリングレートの半分まで
ax.set_ylim(0, 1000)  # 縦軸は音量の範囲を調整

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
