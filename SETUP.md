# Firebase Setup Rehberi

## 1. Firestore Settings Oluşturma

Firebase Console'dan manuel olarak settings dokümanını oluşturun:

### Adımlar:
1. https://console.firebase.google.com/project/lastikoteli-c0043/firestore/data
2. **Start collection** tıklayın
3. Collection ID: `settings`
4. Document ID: `general`
5. Aşağıdaki field'ları ekleyin:

| Field Name | Type | Value |
|------------|------|-------|
| workingDays | array | [1, 2, 3, 4, 5] |
| workingHours | map | { start: "09:00", end: "18:00" } |
| appointmentInterval | number | 30 |
| closedDays | array | [] |

### workingHours Map'i nasıl oluşturulur:
- Field type: **map** seçin
- İçine iki field ekleyin:
  - `start`: string = "09:00"
  - `end`: string = "18:00"

6. **Save** tıklayın

## 2. Admin Kullanıcı Oluşturma

1. https://console.firebase.google.com/project/lastikoteli-c0043/authentication/users
2. **Add user** tıklayın
3. Email: `admin@cantekinlastik.com`
4. Password: Güvenli bir şifre belirleyin
5. **Add user** tıklayın

## 3. Test Randevuları (Opsiyonel)

Settings oluşturduktan sonra:
```bash
npm run test-data
```

## Hazır!

Projeniz kullanıma hazır:
- Public: http://localhost:3000
- Admin Girişi: http://localhost:3000/giris
- Admin Panel: http://localhost:3000/yonetim
