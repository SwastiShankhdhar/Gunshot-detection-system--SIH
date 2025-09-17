# Gunshot Detection and Direction of Arrival using Microphone Array  

Real-time gunshot detection system leveraging microphone arrays for direction of arrival (DOA) estimation and instant alerting. This project combines audio signal processing with machine learning models to accurately classify gunshots, determine their direction, and notify security personnel using automated alerts.

---

## Features  

- Real-time Gunshot Detection: Continuously captures ambient audio and analyzes short clips for gunshot presence.  
- Direction of Arrival (DOA): Uses microphone array beamforming techniques to estimate the direction from which the gunshot originated.  
- Concurrent Pipeline: Built with multi-threaded execution in Python for efficient audio capture, analysis, and alerts.  
- Machine Learning Models: CNN-based models classify gunshot sounds with high accuracy using spectrograms and waveform features.  
- Automated Alerts: Sends SMS alerts with gunshot location and DOA information to security response teams.  
- Edge Deployment Ready: Runs on **Raspberry Pi 3 Model B+** or better with support for external microphone arrays.  

---

## Pipeline Overview  

Our pipeline is orchestrated with **Python** and operates with three concurrent threads:  

1. Audio Capture Thread – Continuously records audio through an attached microphone array and buffers 2-second frames into a queue.  
2. Analysis Thread – Applies ML models to classify whether a gunshot occurred within each 2-second segment and simultaneously performs DOA estimation using array signal processing techniques.  
3. Alert Dispatch Thread – If a gunshot is detected, it sends an SMS notification including timestamp and estimated direction.  

---

## Hardware Requirements  

- Processing Unit: Raspberry Pi 3 Model B+ (or higher)  
- Microphone Array:  
  - ReSpeaker 4-Mic or 6-Mic USB Array (recommended)  
  - Alternative omnidirectional microphones supported  
- Communication Module: AT&T USBConnect Lightning Quickstart SMS Modem (or compatible GSM/4G/LTE modem for SMS messaging)  

Optional peripherals include:  
- Battery pack for remote deployment  
- Outdoor enclosure for weather-proofing  

---

## Software and Dependencies  

- Programming Language: Python 3.7+  
- Audio Libraries: PyAudio, NumPy, SciPy  
- Machine Learning Frameworks: TensorFlow / Keras / PyTorch for model inference  
- Signal Processing: librosa, matplotlib (for spectrograms and feature extraction)  
- SMS/Messaging: pySerial or Twilio API (alternative to hardware SMS modem)  
- Threading/Queues: Python’s `threading` and `queue` libraries  

Install dependencies using:  
```bash
pip install -r requirements.txt
```
---

## Models  

We trained three different neural network models on ~60,000 labeled audio samples (gunshots vs. background noise).  

- 1D-CNN Model: Processes raw waveform inputs (two-second audio segments).  
- 2D-CNN Model (Spectrogram-based): Works on log-mel spectrograms of audio samples for robust classification.  
- Ensemble Voting:Final prediction made using majority consensus across models to reduce false positives.  

For DOA estimation:  
- Implemented GCC-PHAT (Generalized Cross-Correlation with Phase Transform) for time difference of arrival (TDOA) between microphones.  
- Direction is estimated from phase/time delays across the microphone array.  

---

## System Workflow  

1. Audio Acquisition: Multi-mic array captures acoustic data continuously.  
2. Preprocessing: Convert audio to both raw waveform and spectrogram representation.  
3. Gunshot Detection (CNN Models): Classify segment as gunshot or non-gunshot.  
4. Direction Estimation (DOA): Compute incoming angle of sound using array geometry.  
5. Decision Engine: Combine model classifications and DOA result.  
6. Alert Notification: Send SMS with event details (`Gunshot detected at T=12:34:56. Direction: 75° NE`).  

## Example Alert  

```
[Gunshot Detection Alert]  
Time: 2025-09-16 23:00 IST  
Location: Zone A – Campus South Gate  
Detected Sound: Gunshot  
Direction of Arrival: 80° (East)  
```

--- 

## Deployment  

1. Connect Raspberry Pi to microphone array and GSM/LTE modem.  
2. Clone repository into Pi:  
   ```bash
   git clone https://github.com/yourusername/gunshot-doa-detection.git
   cd gunshot-doa-detection
   ```
3. Start detection service:  
   ```bash
   python main.py
   ```
4. Logs and detections will be available inside the `/logs` directory.  

