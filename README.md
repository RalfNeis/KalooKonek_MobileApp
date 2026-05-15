# KalooKonek 📱👴👵

**KalooKonek** is a comprehensive digital identification and health portal system designed specifically for senior citizens in Caloocan City. It modernizes the traditional OSCA ID system by providing a dynamic, secure mobile application linked to a centralized barangay information portal.

## 🚀 Key Features

* **Dynamic Digital ID (QR System):** * **Basic ID:** Instantly scannable QR code for general senior citizen verification.
* **Health Records Management:** Dynamic routing to view specific patient vitals and medical history.
* **Barangay Announcements:** Real-time, timestamped urgent alerts and news directly from the local government.
* **Appointment Scheduling:** Custom appointment requests submitted directly to the barangay administration.
* **Profile Management:** Digital record keeping with profile picture management and customizable contact details.
* **Offline Support:** Skeleton UI implementations and robust error handling for varying network conditions.

## 🛠️ Tech Stack

**Frontend (Mobile App)**
* React Native 
* Expo (Managed Workflow)
* NativeWind (Tailwind CSS for React Native)
* Lucide React Native (Icons)
* Axios (API Client)
* Zustand (State Management)

**Backend (API & Administration)**
* Python / Django
* Django REST Framework (DRF)
* Supabase (Storage)
* SQLite / PostgreSQL

## ⚙️ Local Development Setup

### Prerequisites
* Node.js & npm
* Python 3.10+
* Android Studio (for Emulator) or Expo Go (for physical device)

### 1. Backend Setup (Django)
```bash
# Navigate to backend directory
cd kalookonek-backend

# Activate virtual environment
env\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Run the server (Network Mode)
python manage.py runserver 0.0.0.0:8000
