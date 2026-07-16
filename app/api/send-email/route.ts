import { NextRequest } from "next/server";
import nodemailer from "nodemailer";

// Helper function to parse details from the encoded note string
function parseNote(encodedNote: string) {
  const parts = encodedNote.split(" | ");
  
  let registrationType = "Belirtilmemiş";
  let vehicleType = "Belirtilmemiş";
  let companyName = "";
  const services: string[] = [];
  let customerNote = "";

  if (parts.length > 0) {
    const reg = parts[0].toLowerCase();
    if (reg === "bireysel") registrationType = "Bireysel";
    else if (reg === "kurumsal") registrationType = "Kurumsal";
    else if (reg === "rentacar") registrationType = "Rent A Car";
  }

  if (parts.length > 1) {
    const veh = parts[1].toLowerCase();
    if (veh === "otomobil") vehicleType = "Otomobil";
    else if (veh === "4x4") vehicleType = "4x4 (Arazi Araçı)";
  }

  // Parse remaining parts
  for (let i = 2; i < parts.length; i++) {
    const part = parts[i];
    if (part.startsWith("Firma: ")) {
      companyName = part.substring(7);
    } else if (part.startsWith("Not: ")) {
      customerNote = part.substring(5);
    } else {
      services.push(part);
    }
  }

  return {
    registrationType,
    vehicleType,
    companyName,
    services,
    customerNote
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      email,
      brand,
      model,
      plate,
      appointmentDate,
      appointmentTime,
      note = ""
    } = body;

    // Validate required fields
    if (!name || !phone || !brand || !model || !plate || !appointmentDate || !appointmentTime) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const {
      registrationType,
      vehicleType,
      companyName,
      services,
      customerNote
    } = parseNote(note);

    // Retrieve environment variables
    const host = process.env.SMTP_HOST || "smtp.yandex.com";
    const port = parseInt(process.env.SMTP_PORT || "465");
    const secure = process.env.SMTP_SECURE === "true" || port === 465;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const fromName = process.env.SMTP_FROM_NAME || "Can Tekin Oto Lastik";
    const toEmail = process.env.SMTP_TO_EMAIL || "info@cantekin.com.tr";

    if (!user || !pass) {
      console.error("Mail credentials missing in environment variables");
      return Response.json(
        { success: false, error: "Mail configuration error" },
        { status: 500 }
      );
    }

    // Configure Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      pool: true, // Use SMTP connection pooling to send multiple emails quickly
      maxConnections: 3,
      maxMessages: 10,
      auth: {
        user,
        pass,
      },
      tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: false
      }
    });

    // Format date beautifully (DD/MM/YYYY)
    const formattedDate = appointmentDate.split("-").reverse().join("/");

    // ----------------------------------------------------
    // Template 1: Admin Notification Email HTML
    // ----------------------------------------------------
    const adminHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Yeni Randevu Talebi</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333333; background-color: #f4f6f9; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e1e8ed; }
          .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: #ffffff; padding: 30px 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px; }
          .header p { margin: 5px 0 0 0; opacity: 0.9; font-size: 14px; }
          .badge { display: inline-block; background-color: #10b981; color: white; padding: 6px 12px; border-radius: 20px; font-weight: bold; font-size: 12px; margin-top: 15px; text-transform: uppercase; }
          .content { padding: 30px 25px; }
          .section-title { font-size: 16px; font-weight: 700; color: #1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 25px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px; }
          .info-grid { display: table; width: 100%; }
          .info-row { display: table-row; }
          .info-label { display: table-cell; width: 35%; font-weight: 600; color: #64748b; padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
          .info-value { display: table-cell; color: #1e293b; padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; font-weight: 500; }
          .time-highlight { background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 0 8px 8px 0; margin-bottom: 20px; }
          .time-highlight table { width: 100%; border-collapse: collapse; }
          .time-highlight td { padding: 4px 0; }
          .service-tag { display: inline-block; background-color: #f1f5f9; color: #475569; padding: 4px 10px; border-radius: 6px; font-size: 13px; margin: 4px 2px; border: 1px solid #e2e8f0; }
          .note-box { background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 0 8px 8px 0; color: #78350f; font-size: 14px; font-style: italic; }
          .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
          .footer a { color: #3b82f6; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>CAN TEKİN OTO LASTİK</h1>
            <p>Lastik Oteli & Randevu Takip Sistemi</p>
            <span class="badge">Yeni Randevu Talebi</span>
          </div>
          <div class="content">
            <div class="time-highlight">
              <table>
                <tr>
                  <td style="font-weight: 700; color: #1e3a8a; font-size: 16px; width: 40%;">Randevu Tarihi:</td>
                  <td style="font-weight: 700; color: #1e293b; font-size: 16px;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="font-weight: 700; color: #1e3a8a; font-size: 16px;">Randevu Saati:</td>
                  <td style="font-weight: 700; color: #1e293b; font-size: 16px;">${appointmentTime}</td>
                </tr>
              </table>
            </div>

            <div class="section-title">Müşteri Bilgileri</div>
            <div class="info-grid">
              <div class="info-row">
                <div class="info-label">Ad Soyad:</div>
                <div class="info-value">${name}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Telefon:</div>
                <div class="info-value">${phone}</div>
              </div>
              <div class="info-row">
                <div class="info-label">E-posta:</div>
                <div class="info-value">${email}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Müşteri Tipi:</div>
                <div class="info-value">${registrationType} ${companyName ? `(${companyName})` : ""}</div>
              </div>
            </div>

            <div class="section-title">Araç Bilgileri</div>
            <div class="info-grid">
              <div class="info-row">
                <div class="info-label">Araç Plakası:</div>
                <div class="info-value" style="font-weight: 700; color: #1e3a8a;">${plate}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Marka / Model:</div>
                <div class="info-value">${brand} / ${model}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Araç Türü:</div>
                <div class="info-value">${vehicleType}</div>
              </div>
            </div>

            <div class="section-title">Talep Edilen Hizmetler</div>
            <div style="margin-bottom: 20px;">
              ${services.length > 0 
                ? services.map(s => `<span class="service-tag">${s}</span>`).join("") 
                : `<span class="service-tag">Standart Lastik Değişimi</span>`
              }
            </div>

            ${customerNote ? `
              <div class="section-title">Müşteri Notu</div>
              <div class="note-box">
                "${customerNote}"
              </div>
            ` : ""}
          </div>
          <div class="footer">
            <p>Bu mail Can Tekin Oto Lastik Randevu Sistemi tarafından otomatik olarak oluşturulmuştur.</p>
            <p>&copy; ${new Date().getFullYear()} <a href="https://cantekin.com.tr">cantekin.com.tr</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    // ----------------------------------------------------
    // Template 2: Customer Confirmation Email HTML
    // ----------------------------------------------------
    const customerHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Randevu Talebiniz Alındı</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333333; background-color: #f4f6f9; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e1e8ed; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; padding: 30px 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px; }
          .header p { margin: 5px 0 0 0; opacity: 0.9; font-size: 14px; }
          .content { padding: 30px 25px; }
          .welcome-msg { font-size: 16px; margin-bottom: 20px; color: #1f2937; }
          .time-box { background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; border-radius: 0 8px 8px 0; margin-bottom: 25px; }
          .time-box table { width: 100%; border-collapse: collapse; }
          .time-box td { padding: 4px 0; }
          .details-card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 25px; }
          .details-title { font-weight: 700; color: #0f766e; margin-top: 0; margin-bottom: 12px; font-size: 15px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
          .info-list { margin: 0; padding: 0; list-style: none; font-size: 14px; }
          .info-list li { margin-bottom: 8px; }
          .info-list strong { color: #4b5563; }
          .info-list span { color: #111827; float: right; font-weight: 500; }
          .info-list li::after { content: ""; display: block; clear: both; }
          .reminder-box { background-color: #fef3c7; border: 1px solid #fde68a; color: #92400e; padding: 15px; border-radius: 8px; font-size: 13.5px; margin-bottom: 25px; }
          .reminder-box strong { color: #78350f; }
          .btn-container { text-align: center; margin: 30px 0; }
          .btn { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff !important; display: inline-block; padding: 12px 30px; font-weight: bold; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2); }
          .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
          .footer a { color: #10b981; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Randevunuz Alındı</h1>
            <p>Sayın ${name}, randevu talebiniz başarıyla kaydedilmiştir.</p>
          </div>
          <div class="content">
            <p class="welcome-msg">Merhaba,</p>
            <p>Randevu talebiniz başarıyla sistemimize kaydedilmiştir. Randevu bilgileriniz aşağıda yer almaktadır:</p>
            
            <div class="time-box">
              <table>
                <tr>
                  <td style="font-weight: 700; color: #065f46; font-size: 16px; width: 40%;">Randevu Tarihi:</td>
                  <td style="font-weight: 700; color: #111827; font-size: 16px;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="font-weight: 700; color: #065f46; font-size: 16px;">Randevu Saati:</td>
                  <td style="font-weight: 700; color: #111827; font-size: 16px;">${appointmentTime}</td>
                </tr>
              </table>
            </div>

            <div class="details-card">
              <h3 class="details-title">Randevu Detayları</h3>
              <ul class="info-list">
                <li><strong>Araç Plakası:</strong> <span>${plate}</span></li>
                <li><strong>Araç Marka / Model:</strong> <span>${brand} / ${model}</span></li>
                <li><strong>Müşteri Adı:</strong> <span>${name}</span></li>
                <li><strong>Telefon Numarası:</strong> <span>${phone}</span></li>
                ${services.length > 0 ? `<li><strong>Talep Edilen:</strong> <span style="font-size:12px;">${services.join(", ")}</span></li>` : ""}
              </ul>
            </div>

            <div class="reminder-box">
              <strong>Önemli Bilgilendirme:</strong>
              <p style="margin: 5px 0 0 0;">Randevu saatinizden 10 dakika önce servis noktamızda bulunmanızı rica ederiz. Randevu iptali veya değişiklik talepleriniz için bizimle iletişime geçebilirsiniz.</p>
            </div>

            <p style="font-size: 14px; color: #6b7280;">Bizi tercih ettiğiniz için teşekkür ederiz.</p>
            <p style="font-size: 14px; font-weight: bold; color: #374151; margin-top: 5px;">Can Tekin Oto Lastik</p>
          </div>
          <div class="footer">
            <p>Herhangi bir sorunuz varsa bize ulaşabilirsiniz: <a href="mailto:info@cantekin.com.tr">info@cantekin.com.tr</a></p>
            <p>&copy; ${new Date().getFullYear()} <a href="https://cantekin.com.tr">cantekin.com.tr</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    // ----------------------------------------------------
    // Send Emails
    // ----------------------------------------------------

    // Send admin email
    const mailOptionsAdmin = {
      from: `"${fromName}" <${user}>`,
      to: toEmail,
      subject: `Yeni Randevu Talebi - ${name} (${plate})`,
      html: adminHtml,
      replyTo: email || undefined
    };

    let adminMailSent = false;
    let customerMailSent = false;
    let adminMailError = "";
    let customerMailError = "";

    const mailPromises = [];

    // Send customer email if an email address is provided
    if (email && email.includes("@")) {
      const mailOptionsCustomer = {
        from: `"${fromName}" <${user}>`,
        to: email,
        subject: `Randevu Talebiniz Alındı - Can Tekin Oto Lastik`,
        html: customerHtml,
      };

      mailPromises.push(
        transporter.sendMail(mailOptionsCustomer)
          .then(() => {
            customerMailSent = true;
          })
          .catch((err: any) => {
            console.error("Failed to send customer confirmation email:", err);
            customerMailError = err?.message || String(err);
          })
      );
    }

    // Send admin email
    mailPromises.push(
      transporter.sendMail(mailOptionsAdmin)
        .then(() => {
          adminMailSent = true;
        })
        .catch((err: any) => {
          console.error("Failed to send admin email:", err);
          adminMailError = err?.message || String(err);
        })
    );

    // Wait for all email operations to complete
    await Promise.all(mailPromises);

    // Close the transporter connection pool
    transporter.close();

    console.log("Email status details:", { adminMailSent, customerMailSent, adminMailError, customerMailError });

    return Response.json({
      success: adminMailSent || customerMailSent,
      message: "Email sending process completed",
      adminMailSent,
      customerMailSent,
      adminMailError,
      customerMailError
    });

  } catch (error: any) {
    console.error("Error in send-email API Route:", error);
    return Response.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
