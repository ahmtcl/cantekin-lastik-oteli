# 🔒 Güvenlik Özellikleri

Bu belge, Lastik Oteli projesinde uygulanan güvenlik önlemlerini açıklar.

## ✅ Uygulanan Güvenlik Önlemleri

### 1. **Firestore Security Rules**
- ✅ **Authentication Required**: Randevu okuma, güncelleme ve silme işlemleri sadece giriş yapmış personel tarafından yapılabilir
- ✅ **Data Validation**: Tüm input alanları (name, email, phone, plate, date, time) server-side validate ediliyor
- ✅ **Length Limits**: Her alan için maximum uzunluk limiti var (XSS ve spam koruması)
- ✅ **Status Protection**: Randevu durumu sadece belirli değerler alabilir (bekliyor, hazirlaniyor, hazir, tamamlandi)
- ✅ **Immutable Fields**: Randevu güncellenirken sadece `status` ve `updatedAt` alanları değiştirilebilir
- ✅ **Timestamp Validation**: createdAt ve updatedAt server timestamp ile doğrulanıyor

### 2. **Input Validation & Sanitization**
- ✅ **XSS Protection**: `sanitizeString()` fonksiyonu ile HTML/script tag'leri temizleniyor
- ✅ **Email Validation**: RFC 5322 compliant regex ile doğrulama
- ✅ **Phone Validation**: Türkiye telefon format kontrolü (05XXXXXXXXX)
- ✅ **Plate Validation**: Türkiye plaka format kontrolü
- ✅ **Name Validation**: Sadece harf ve Türkçe karakterler, 2-100 karakter
- ✅ **Date Validation**: Geçmiş tarih kontrolü, 2 yıl ileri limit
- ✅ **Time Validation**: HH:MM format kontrolü
- ✅ **Length Limits**: Tüm string alanları 500 karakter ile limitli

### 3. **Authentication & Authorization**
- ✅ **Firebase Authentication**: Email/Password ile güvenli giriş
- ✅ **AuthGuard Component**: Client-side yetkilendirme kontrolü
- ✅ **Protected Routes**: Yönetim paneli sadece giriş yapanlara açık
- ✅ **Remember Me**: LocalStorage ile güvenli email saklama
- ✅ **Auto-logout**: Oturum süresi dolduğunda otomatik çıkış

### 4. **HTTP Security Headers**
```
✅ Strict-Transport-Security (HSTS)
✅ X-Frame-Options (Clickjacking koruması)
✅ X-Content-Type-Options (MIME sniffing koruması)
✅ X-XSS-Protection (XSS koruması)
✅ Referrer-Policy (Referrer bilgisi kontrolü)
✅ Permissions-Policy (Kamera/mikrofon/konum erişimi kapalı)
```

### 5. **Environment Variables**
- ✅ **Gitignore**: `.env*` dosyaları git'e commit edilmiyor
- ✅ **Vercel Secrets**: Tüm API key'ler Vercel'de güvenli saklanıyor
- ✅ **Client-safe**: NEXT_PUBLIC_ prefix ile sadece gerekli key'ler client'a expose ediliyor

### 6. **Firebase API Key Security**
⚠️ **Not**: Firebase API key'leri client-side'da görünür ama bu normal ve güvenli:
- Firebase API key'leri public'tir (Google'ın resmi dokümantasyonu)
- Gerçek güvenlik Firebase Security Rules ile sağlanıyor
- API key'ler sadece Firebase servislerine bağlanmak için kullanılıyor
- **Önemli**: Firebase Console → Project Settings → Restrictions'dan:
  - HTTP referrers kısıtlaması ekleyin (sadece domain'inizden istek kabul etsin)
  - Android/iOS için package name kısıtlaması ekleyin

### 7. **Rate Limiting & Abuse Prevention**
- ✅ **Firestore Rules**: Her create/update/delete için authentication gerekli
- ✅ **Input Length Limits**: Spam ve DoS saldırılarına karşı koruma
- ⚠️ **Gelecek İyileştirme**: Cloud Functions ile rate limiting eklenebilir

### 8. **Data Privacy**
- ✅ **KVKK Uyumluluğu**: Randevu formunda KVKK onayı alınıyor
- ✅ **Minimal Data**: Sadece gerekli bilgiler toplanıyor
- ✅ **Secure Storage**: Tüm data Firestore'da şifreli saklanıyor
- ✅ **Access Control**: Kişisel veriler sadece yetkili personel tarafından görülebilir

## 🛡️ Güvenlik Best Practices

### Firebase Console Ayarları
1. **Authentication** → **Sign-in method**:
   - Email/Password enabled
   - Email enumeration protection: ENABLED
   - Password policy: Strong (min 8 karakter, özel karakter gerekli)

2. **Firestore** → **Rules**:
   - `firestore.rules` dosyasını deploy edin:
     ```bash
     firebase deploy --only firestore:rules
     ```

3. **Project Settings** → **API Restrictions**:
   - HTTP referrers ekleyin:
     - `localhost/*` (development)
     - `cantekin-lastik-oteli.vercel.app/*` (production)
     - `*.vercel.app/*` (preview deployments)

### Vercel Ayarları
1. **Environment Variables**:
   - Tüm `NEXT_PUBLIC_FIREBASE_*` değişkenler Production ve Preview'da set edilmiş olmalı
   - Never commit `.env.local` to git

2. **Deployment Protection**:
   - Preview deployments'a password koruması eklenebilir
   - Production branch: `main`

## 🚨 Güvenlik Kontrol Listesi

Deployment öncesi kontrol edin:

- [ ] Firebase Security Rules deploy edildi
- [ ] Environment variables Vercel'de set edildi
- [ ] `.env.local` dosyası gitignore'da
- [ ] Firebase Console'da HTTP referrers kısıtlaması eklendi
- [ ] Email/Password authentication enabled
- [ ] Strong password policy enabled
- [ ] Firestore'da test verisi yok
- [ ] Production'da console.log'lar temizlendi (opsiyonel)
- [ ] HTTPS zorunlu (Vercel otomatik sağlıyor)

## 🔐 Acil Durum Prosedürü

Güvenlik ihlali durumunda:

1. **Hemen**: Firebase Console → Authentication → Users → Şüpheli kullanıcıları disable edin
2. **Hemen**: Vercel → Settings → Environment Variables → Tüm değişkenleri yeniden oluşturun
3. **1 saat içinde**: Firebase API key'leri rotate edin (yeni proje oluşturma gerekebilir)
4. **24 saat içinde**: Tüm kullanıcı şifrelerini resetleyin
5. **Raporlama**: İhlal detaylarını dokümante edin

## 📞 İletişim

Güvenlik açığı tespit ederseniz:
- GitHub Issues kullanmayın (public görünür)
- Doğrudan proje sahibi ile iletişime geçin

## 📚 Referanslar

- [Firebase Security Best Practices](https://firebase.google.com/docs/rules/basics)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)
- [KVKK Uyumluluk](https://kvkk.gov.tr/)
