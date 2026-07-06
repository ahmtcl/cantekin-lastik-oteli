# Can Tekin Oto Lastik - Lastik Oteli Randevu Sistemi

Modern, minimal ve kurumsal bir lastik oteli randevu yönetim sistemi.

## Teknolojiler

- **Framework**: Next.js 15 (App Router)
- **Dil**: TypeScript
- **Stil**: Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore)
- **Deployment**: Vercel

## Özellikler

### Public (Müşteri) Özellikleri
- Ana sayfa
- Randevu oluşturma formu
- Tarih ve saat seçimi
- Müsait saat kontrolü
- Telefon ve plaka validasyonu

### Admin Özellikleri
- Firebase Authentication ile güvenli giriş
- Dashboard (Bugünün randevuları)
- Tüm randevuları listeleme ve arama
- Randevu detayı görüntüleme
- Durum güncelleme (Bekliyor, Hazırlanıyor, Hazır, Tamamlandı)
- Çalışma günleri ve saatleri ayarları
- Randevu aralığı ayarları

## Kurulum

### 1. Projeyi Klonlayın

\`\`\`bash
git clone <repository-url>
cd lastik-oteli
\`\`\`

### 2. Bağımlılıkları Yükleyin

\`\`\`bash
npm install
\`\`\`

### 3. Firebase Projesi Oluşturun

1. [Firebase Console](https://console.firebase.google.com/) üzerinden yeni bir proje oluşturun
2. Authentication → Email/Password provider'ı etkinleştirin
3. Firestore Database oluşturun
4. Proje ayarlarından Firebase yapılandırma bilgilerini alın

### 4. Ortam Değişkenlerini Ayarlayın

\`.env.local.example\` dosyasını \`.env.local\` olarak kopyalayın ve Firebase bilgilerinizi girin:

\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
\`\`\`

### 5. Firestore Güvenlik Kurallarını Uygulayın

\`firestore.rules\` dosyasındaki kuralları Firebase Console'da Firestore → Rules bölümüne kopyalayın.

### 6. İlk Admin Kullanıcısını Oluşturun

Firebase Console → Authentication → Users bölümünden manuel olarak bir kullanıcı ekleyin.

### 7. Geliştirme Sunucusunu Başlatın

\`\`\`bash
npm run dev
\`\`\`

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

## Kullanım

### Müşteri Tarafı

1. Ana sayfadan "Randevu Oluştur" butonuna tıklayın
2. Formu doldurun (Ad Soyad, Telefon, Plaka)
3. Uygun bir tarih seçin
4. Müsait saatlerden birini seçin
5. İsteğe bağlı not ekleyin
6. "Randevu Oluştur" butonuna tıklayın

### Admin Tarafı

1. \`/giris\` sayfasından giriş yapın
2. Dashboard'da bugünün randevularını görüntüleyin
3. "Randevular" sayfasında tüm randevuları listeleyin ve arayın
4. Randevulara tıklayarak detayları görüntüleyin ve durumlarını güncelleyin
5. "Ayarlar" sayfasından çalışma günleri, saatleri ve randevu aralığını ayarlayın

## Proje Yapısı

\`\`\`
lastik-oteli/
├── app/
│   ├── giris/              # Personel giriş sayfası
│   ├── randevu/            # Randevu oluşturma sayfası
│   ├── tesekkur/           # Teşekkür sayfası
│   ├── yonetim/            # Yönetim paneli
│   │   ├── randevular/     # Tüm randevular
│   │   ├── ayarlar/        # Sistem ayarları
│   │   └── layout.tsx      # Admin layout
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Ana sayfa
├── components/             # Reusable UI bileşenleri
├── features/               # Feature-specific bileşenler
│   └── appointments/
├── lib/
│   ├── firebase/           # Firebase yapılandırması
│   ├── hooks/              # Custom React hooks
│   ├── services/           # Firestore servisleri
│   ├── types/              # TypeScript tipleri
│   └── utils/              # Utility fonksiyonları
├── firestore.rules         # Firestore güvenlik kuralları
└── .env.local              # Ortam değişkenleri
\`\`\`

## Firestore Collections

### appointments
- name: string
- phone: string
- plate: string
- appointmentDate: string
- appointmentTime: string
- note?: string
- status: "bekliyor" | "hazirlaniyor" | "hazir" | "tamamlandi"
- createdAt: Timestamp
- updatedAt: Timestamp

### settings
- workingDays: number[]
- workingHours: { start: string, end: string }
- appointmentInterval: number
- closedDays: string[]

### users
- name: string
- email: string
- role: "admin" | "staff"
- createdAt: Timestamp

## Deployment

### Vercel'e Deploy

1. Vercel hesabınıza giriş yapın
2. Projeyi import edin
3. Environment variables'ı ekleyin (.env.local'daki tüm değişkenler)
4. Deploy edin

## Lisans

Bu proje özel kullanım içindir.

## İletişim

Can Tekin Oto Lastik
