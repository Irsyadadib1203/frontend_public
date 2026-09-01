import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description:
    "Kebijakan privasi TOPUPSTORE mengenai bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi pengguna.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="font-gaming text-sm md:text-base font-bold text-foreground">{title}</h2>
      <div className="text-xs md:text-sm text-muted-foreground leading-relaxed space-y-2">{children}</div>
    </section>
  );
}

export default function KebijakanPrivasiPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <div className="mb-10 text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-primary/15 border border-primary/30 px-3 py-1 rounded-full text-xs font-bold text-primary">
              <ShieldCheck className="h-3.5 w-3.5" /> Kebijakan Privasi
            </div>
            <h1 className="font-gaming text-2xl md:text-4xl font-extrabold text-foreground">
              Kebijakan Privasi
            </h1>
            <p className="text-xs text-muted-foreground">
              Terakhir diperbarui: 28 Agustus 2026
            </p>
          </div>

          <div className="bg-card/80 border border-border/60 rounded-2xl p-6 md:p-8 space-y-8">
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              TOPUPSTORE (&ldquo;kami&rdquo;) menghargai dan menghormati privasi setiap pengguna (&ldquo;Anda&rdquo;) yang mengakses dan
              menggunakan layanan kami melalui situs ini. Kebijakan Privasi ini menjelaskan bagaimana kami
              mengumpulkan, menggunakan, menyimpan, membagikan, dan melindungi data pribadi Anda. Dengan menggunakan
              layanan kami, Anda dianggap telah membaca, memahami, dan menyetujui Kebijakan Privasi ini.
            </p>

            <Section title="1. Data yang Kami Kumpulkan">
              <p>Kami dapat mengumpulkan data berikut saat Anda menggunakan layanan kami:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Data identitas: nama, alamat email, dan nomor telepon/WhatsApp.</li>
                <li>Data akun: username, kata sandi (tersimpan dalam bentuk terenkripsi), dan riwayat aktivitas akun.</li>
                <li>Data transaksi: detail pesanan, ID game/User ID/Server ID, nominal top up, metode pembayaran, dan status transaksi.</li>
                <li>Data teknis: alamat IP, jenis perangkat, jenis browser, dan data log akses situs (cookies).</li>
                <li>Data komunikasi: percakapan Anda dengan tim layanan pelanggan (customer service).</li>
              </ul>
            </Section>

            <Section title="2. Tujuan Penggunaan Data">
              <p>Data yang kami kumpulkan digunakan untuk tujuan berikut:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Memproses dan menyelesaikan transaksi top up/pembelian voucher yang Anda lakukan.</li>
                <li>Melakukan verifikasi identitas dan mencegah penipuan atau penyalahgunaan layanan.</li>
                <li>Memberikan layanan pelanggan, termasuk menanggapi pertanyaan dan keluhan.</li>
                <li>Mengirimkan informasi terkait status transaksi, promo, dan pembaruan layanan (jika Anda berlangganan).</li>
                <li>Meningkatkan kualitas produk, fitur, dan pengalaman pengguna di situs kami.</li>
                <li>Memenuhi kewajiban hukum yang berlaku di Indonesia.</li>
              </ul>
            </Section>

            <Section title="3. Pembagian Data kepada Pihak Ketiga">
              <p>
                Kami tidak menjual data pribadi Anda kepada pihak manapun. Namun, kami dapat membagikan data
                tertentu kepada pihak ketiga berikut sebatas yang diperlukan untuk menjalankan layanan:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong className="text-foreground">Payment gateway</strong> (seperti Tripay dan mitra pembayaran
                  lainnya) untuk memproses pembayaran Anda secara aman.
                </li>
                <li>
                  <strong className="text-foreground">Penyedia/provider game &amp; voucher</strong> untuk memproses
                  pengiriman item digital sesuai pesanan Anda.
                </li>
                <li>
                  Pihak berwenang, apabila diwajibkan oleh hukum atau proses hukum yang sah.
                </li>
              </ul>
            </Section>

            <Section title="4. Penyimpanan dan Keamanan Data">
              <p>
                Kami menerapkan langkah-langkah teknis dan organisasi yang wajar untuk melindungi data pribadi Anda
                dari akses tidak sah, kehilangan, penyalahgunaan, atau perubahan data, termasuk enkripsi data
                sensitif dan pembatasan akses internal. Data Anda kami simpan selama diperlukan untuk tujuan yang
                dijelaskan dalam kebijakan ini atau sesuai ketentuan hukum yang berlaku.
              </p>
            </Section>

            <Section title="5. Cookies">
              <p>
                Situs kami menggunakan cookies dan teknologi serupa untuk menjaga sesi login, mengingat preferensi
                pengguna, serta menganalisis penggunaan situs guna meningkatkan layanan. Anda dapat mengatur browser
                Anda untuk menolak cookies, namun hal ini dapat memengaruhi fungsi tertentu pada situs.
              </p>
            </Section>

            <Section title="6. Hak Pengguna">
              <p>Sebagai pemilik data, Anda berhak untuk:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Mengakses dan meminta salinan data pribadi yang kami simpan tentang Anda.</li>
                <li>Meminta koreksi atas data yang tidak akurat.</li>
                <li>Meminta penghapusan akun dan data pribadi Anda, sepanjang tidak bertentangan dengan kewajiban hukum kami (misalnya kewajiban penyimpanan data transaksi).</li>
                <li>Menarik persetujuan atas pemrosesan data untuk keperluan pemasaran.</li>
              </ul>
              <p>
                Untuk menggunakan hak-hak di atas, Anda dapat menghubungi kami melalui kontak yang tercantum pada
                bagian akhir halaman ini.
              </p>
            </Section>

            <Section title="7. Perubahan Kebijakan Privasi">
              <p>
                Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu untuk menyesuaikan dengan perubahan
                layanan atau ketentuan hukum. Perubahan akan diinformasikan melalui halaman ini dengan mencantumkan
                tanggal pembaruan terbaru.
              </p>
            </Section>

            <Section title="8. Hubungi Kami">
              <p>
                Jika Anda memiliki pertanyaan atau keluhan terkait Kebijakan Privasi ini, silakan hubungi kami
                melalui:
              </p>
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
