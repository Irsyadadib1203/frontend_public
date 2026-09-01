import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, Zap, Headphones, Target, Eye, Instagram, MessageCircle, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Kenali lebih dekat TOPUPSTORE (IRXPLAY), platform top up game dan voucher game online terpercaya di Indonesia.",
};

export default function TentangKamiPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-10 text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-primary/15 border border-primary/30 px-3 py-1 rounded-full text-xs font-bold text-primary">
              Tentang Kami
            </div>
            <h1 className="font-gaming text-2xl md:text-4xl font-extrabold text-foreground">
              TOPUP<span className="text-primary">STORE</span>
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground max-w-2xl mx-auto">
              Platform top up game dan voucher game online yang cepat, aman, dan terpercaya untuk para gamer di seluruh Indonesia.
            </p>
          </div>

          {/* Deskripsi */}
          <section className="bg-card/80 border border-border/60 rounded-2xl p-6 md:p-8 mb-6 space-y-4 text-xs md:text-sm text-muted-foreground leading-relaxed">
            <p>
              TOPUPSTORE (dikenal juga dengan nama brand <strong className="text-foreground">IRXPLAY</strong>) adalah
              platform penyedia layanan top up game, isi ulang diamond, dan voucher game digital secara online. Kami
              hadir untuk memudahkan para gamer di Indonesia melakukan pengisian ulang item dalam game favorit
              mereka&mdash;seperti Mobile Legends, Free Fire, PUBG Mobile, Genshin Impact, dan ratusan game lainnya&mdash;dengan
              proses yang instan, harga bersaing, dan metode pembayaran yang lengkap.
            </p>
            <p>
              Kami bekerja sama dengan penyedia gateway pembayaran resmi untuk memastikan setiap transaksi diproses
              secara aman, mendukung berbagai metode pembayaran seperti QRIS, transfer bank, e-wallet, dan
              minimarket/retail.
            </p>
            <p>
              [Catatan pemilik situs: bagian ini dapat disesuaikan dengan nama badan usaha resmi (perorangan/CV/PT),
              nomor legalitas usaha bila ada, serta tahun berdiri, agar sesuai dengan identitas usaha yang didaftarkan
              ke Tripay.]
            </p>
          </section>

          {/* Visi Misi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-card/80 border border-border/60 rounded-2xl p-6 space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <Eye className="h-5 w-5" />
                <h2 className="font-gaming text-sm font-bold text-foreground">Visi</h2>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Menjadi platform top up game dan voucher digital nomor satu di Indonesia yang dipercaya jutaan gamer
                karena kecepatan, keamanan, dan kejujuran layanannya.
              </p>
            </div>
            <div className="bg-card/80 border border-border/60 rounded-2xl p-6 space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <Target className="h-5 w-5" />
                <h2 className="font-gaming text-sm font-bold text-foreground">Misi</h2>
              </div>
              <ul className="text-xs text-muted-foreground leading-relaxed list-disc list-inside space-y-1">
                <li>Menyediakan layanan top up yang cepat dan otomatis 24 jam nonstop.</li>
                <li>Menjaga keamanan data dan transaksi setiap pelanggan.</li>
                <li>Memberikan harga yang transparan dan kompetitif.</li>
                <li>Menghadirkan layanan pelanggan yang responsif dan ramah.</li>
              </ul>
            </div>
          </div>

          {/* Kenapa Pilih Kami */}
          <section className="mb-10">
            <h2 className="font-gaming text-sm font-bold text-foreground mb-4 text-center uppercase tracking-wider">
              Kenapa Memilih Kami
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3 bg-muted/20 p-4 rounded-2xl border border-border/40">
                <div className="p-3 bg-primary/15 rounded-xl text-primary">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-gaming text-xs font-bold text-foreground">Proses Instan</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Transaksi diproses otomatis dalam hitungan detik tanpa perlu menunggu konfirmasi manual.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-muted/20 p-4 rounded-2xl border border-border/40">
                <div className="p-3 bg-secondary/15 rounded-xl text-secondary">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-gaming text-xs font-bold text-foreground">Aman &amp; Terpercaya</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Pembayaran diproses melalui payment gateway resmi dengan enkripsi standar industri.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-muted/20 p-4 rounded-2xl border border-border/40">
                <div className="p-3 bg-cyan-500/15 rounded-xl text-cyan-400">
                  <Headphones className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-gaming text-xs font-bold text-foreground">CS Siap Membantu</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Tim layanan pelanggan kami siap membantu kendala transaksi melalui WhatsApp.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Kontak */}
          <section className="bg-card/80 border border-border/60 rounded-2xl p-6 md:p-8">
            <h2 className="font-gaming text-sm font-bold text-foreground mb-4">Hubungi Kami</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground">
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp CS: +62 812-3456-7890
              </a>
              <a
                href="mailto:support@topupstore.com"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" /> support@topupstore.com
              </a>
              <a
                href="https://instagram.com/irxplay"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Instagram className="h-4 w-4" /> @irxplay
              </a>
            </div>
            <p className="text-[11px] text-muted-foreground mt-4">
              [Catatan: ganti alamat email dan nomor WhatsApp di atas dengan kontak resmi bisnis Anda. Anda juga dapat
              menambahkan alamat kantor/domisili usaha di sini bila diperlukan untuk verifikasi merchant.]
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
