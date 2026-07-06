import Link from "next/link";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Container>
        <div className="max-w-2xl mx-auto text-center py-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Can Tekin Lastik Oteli Randevu Sistemi
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Lastik değişimi için uygun gün ve saati seçerek kolayca randevunuzu
            oluşturabilirsiniz.
          </p>
          <Link href="/randevu">
            <Button>Randevu Oluştur</Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}

