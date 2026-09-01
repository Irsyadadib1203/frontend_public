import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan Layanan",
  description:
    "Syarat dan ketentuan penggunaan layanan top up game dan voucher game online TOPUPSTORE.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="font-gaming text-sm md:text-base font-bold text-foreground">{title}</h2>
      <div className="text-xs md:text-sm text-muted-foreground leading-relaxed space-y-2">{children}</div>
    </section>
  );
}

export default function SyaratKetentuanPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <div className="mb-10 text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-primary/15 border border-primary/30 px-3 py-1 rounded-full text-xs font-bold text-primary">
              <FileText className="h-3.5 w-3.5" /> Syarat &amp; Ketentuan
            </div>
            <h1 className="font-gaming text-2xl md:text-4xl font-extrabold text-foreground">
              Syarat &amp; Ketentuan Layanan
            </h1>
            <p className="text-xs text-muted-foreground">
              Terakhir diperbarui: 28 Agustus 2026
            </p>
          </div>

          <div className="bg-card/80 border border-border/60 rounded-2xl p-6 md:p-8 space-y-8">
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              Selamat datang di TOPUPSTORE. Syarat &amp; Ketentuan ini (&ldquo;Ketentuan&rdquo;) mengatur penggunaan Anda atas
              situs dan layanan top up game/voucher game yang kami sediakan. Dengan mengakses atau menggunakan
              layanan kami, Anda dianggap telah membaca, memahami, dan menyetujui untuk terikat pada Ketentuan ini.
              Jika Anda tidak menyetujui Ketentuan ini, mohon untuk tidak menggunakan layanan kami.
            </p>

            <Section title="1. Definisi Layanan">
              <p>
                TOPUPSTORE menyediakan layanan penjualan item digital berupa top up diamond/kredit game, voucher
                game, dan produk digital sejenis (&ldquo;Produk&rdquo;) yang dikirimkan secara elektronik ke akun game milik
                pengguna sesuai data yang diinput oleh pengguna sendiri.
              </p>
            </Section>

            <Section title="2. Akun Pengguna">
              <ul className="list-disc list-inside space-y-1">
                <li>Pengguna wajib mendaftar dengan data yang benar, akurat, dan terkini.</li>
                <li>Pengguna bertanggung jawab penuh atas kerahasiaan kata sandi dan seluruh aktivitas yang terjadi pada akunnya.</li>
                <li>Kami berhak menangguhkan atau menghapus akun yang terindikasi melakukan kecurangan, penyalahgunaan sistem, atau pelanggaran terhadap Ketentuan ini.</li>
              </ul>
            </Section>

            <Section title="3. Pemesanan dan Pembayaran">
              <ul className="list-disc list-inside space-y-1">
                <li>Pengguna wajib memastikan kebenaran data pesanan, termasuk User ID, Server ID, atau data akun game lain yang diminta, sebelum melakukan pembayaran.</li>
                <li>Kesalahan input data yang diakibatkan kelalaian pengguna sepenuhnya menjadi tanggung jawab pengguna, dan Produk yang telah terkirim ke akun/ID yang salah tidak dapat dikembalikan.</li>
                <li>Pembayaran dapat dilakukan melalui metode yang tersedia di situs (QRIS, transfer bank, e-wallet, minimarket/retail, dan/atau saldo member), yang diproses melalui payment gateway pihak ketiga.</li>
                <li>Pesanan akan diproses secara otomatis setelah pembayaran berhasil dikonfirmasi oleh sistem.</li>
              </ul>
            </Section>

            <Section title="4. Kebijakan Pembatalan dan Pengembalian Dana (Refund)">
              <ul className="list-disc list-inside space-y-1">
                <li>Karena sifat Produk yang berupa barang digital yang langsung dikirim ke akun tujuan, pesanan yang telah berhasil diproses tidak dapat dibatalkan.</li>
                <li>Pengembalian dana (refund) hanya akan diberikan apabila Produk gagal terkirim akibat kesalahan sistem kami dan tidak dapat diproses ulang dalam batas waktu yang wajar.</li>
                <li>Pengajuan refund/komplain dapat dilakukan melalui layanan pelanggan (CS) kami maksimal 1x24 jam setelah transaksi, dengan menyertakan bukti pembayaran dan detail pesanan.</li>
                <li>Dana yang sudah masuk ke saldo member (deposit) tidak dapat ditarik/dicairkan kembali ke rekening bank, kecuali ditentukan lain oleh kebijakan kami.</li>
              </ul>
            </Section>

            <Section title="5. Kewajiban dan Larangan Pengguna">
              <p>Pengguna dilarang untuk:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Menggunakan layanan untuk tujuan penipuan, pencucian uang, atau aktivitas ilegal lainnya.</li>
                <li>Melakukan chargeback atau sanggahan pembayaran yang tidak berdasar setelah Produk berhasil dikirim.</li>
                <li>Mencoba mengeksploitasi celah sistem (bug) untuk memperoleh keuntungan yang tidak sah.</li>
                <li>Menyalahgunakan identitas pihak lain saat melakukan transaksi.</li>
              </ul>
              <p>
                Pelanggaran atas larangan ini dapat mengakibatkan pemblokiran akun secara permanen dan pelaporan
                kepada pihak berwenang bila diperlukan.
              </p>
            </Section>

            <Section title="6. Batasan Tanggung Jawab">
              <p>
                Kami berupaya menjaga layanan tetap tersedia dan berjalan lancar, namun tidak bertanggung jawab atas
                kerugian yang timbul akibat gangguan di luar kendali kami, termasuk namun tidak terbatas pada
                gangguan pada sistem penyedia game/provider pihak ketiga, gangguan jaringan internet, atau kejadian
                force majeure.
              </p>
            </Section>

            <Section title="7. Perubahan Ketentuan">
              <p>
                Kami berhak mengubah, menambah, atau memperbarui Ketentuan ini sewaktu-waktu. Perubahan akan berlaku
                sejak dipublikasikan pada halaman ini. Penggunaan layanan yang berkelanjutan setelah perubahan
                dianggap sebagai persetujuan atas Ketentuan yang telah diperbarui.
              </p>
            </Section>

            <Section title="8. Hukum yang Berlaku">
              <p>
                Ketentuan ini diatur dan ditafsirkan sesuai dengan hukum yang berlaku di Republik Indonesia. Setiap
                perselisihan yang timbul akan diselesaikan secara musyawarah, dan apabila tidak tercapai kesepakatan,
                akan diselesaikan sesuai ketentuan hukum yang berlaku.
              </p>
            </Section>

            <Section title="9. Hubungi Kami">
              <p>Untuk pertanyaan terkait Syarat &amp; Ketentuan ini, silakan hubungi kami melalui:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>WhatsApp: +62 812-3456-7890</li>
                <li>Email: support@topupstore.com</li>
                <li>Instagram: @irxplay</li>
              </ul>
              <p className="text-[11px] italic">
                [Catatan pemilik situs: ganti kontak di atas dengan email/nomor resmi bisnis Anda sebelum
                mengajukan ulang verifikasi merchant.]
              </p>
            </Section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
