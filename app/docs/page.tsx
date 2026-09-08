"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BellRing,
  BookOpen,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  ExternalLink,
  Hash,
  KeyRound,
  Layers,
  Lock,
  RefreshCw,
  Server,
  ShieldCheck,
  Tag,
  Wallet,
  Zap,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BASE_URL = "https://api1235.irxplay.com";

type Parameter = { field: string; type: string; required: string; description: string };

const balanceParams: Parameter[] = [
  { field: "cmd", type: "string", required: "Ya", description: 'Isi dengan nilai "deposit".' },
  { field: "username", type: "string", required: "Ya", description: "API Key / Username akun Anda." },
  { field: "sign", type: "string", required: "Ya", description: 'md5(username + secret + "depo")' },
];

const priceListParams: Parameter[] = [
  { field: "cmd", type: "string", required: "Ya", description: 'Isi dengan nilai "prepaid".' },
  { field: "username", type: "string", required: "Ya", description: "API Key / Username akun Anda." },
  { field: "sign", type: "string", required: "Ya", description: 'md5(username + secret + "pricelist")' },
  { field: "code", type: "string", required: "Opsional", description: "Filter spesifik kode SKU produk." },
];

const transactionParams: Parameter[] = [
  { field: "username", type: "string", required: "Ya", description: "API Key / Username akun Anda." },
  { field: "buyer_sku_code", type: "string", required: "Ya", description: "Kode SKU dari Price List, misalnya MLBB_86." },
  { field: "customer_no", type: "string", required: "Ya", description: "Tujuan ID akun. Untuk Zone/Server gunakan format 12345678(2001)." },
  { field: "ref_id", type: "string", required: "Ya", description: "ID referensi unik dari sistem Anda. Pengiriman ulang ID yang sama tidak akan charge ganda." },
  { field: "sign", type: "string", required: "Ya", description: "md5(username + secret + ref_id)" },
  { field: "testing", type: "boolean", required: "Opsional", description: "Set true untuk sandbox tanpa potong saldo nyata." },
  { field: "callback_url", type: "string", required: "Opsional", description: "URL webhook untuk menerima notifikasi hasil transaksi." },
];

const balanceRequest = `{
  "cmd": "deposit",
  "username": "top_partner_abc",
  "sign": "md5(username + secret + 'depo')"
}`;

const balanceResponse = `{
  "data": {
    "deposit": 1250000
  }
}`;

const priceRequest = `{
  "cmd": "prepaid",
  "username": "top_partner_abc",
  "sign": "md5(username + secret + 'pricelist')"
}`;

const priceResponse = `{
  "data": [
    {
      "product_name": "Mobile Legends 86 Diamonds",
      "category": "Games",
      "brand": "Mobile Legends: Bang Bang",
      "price": 19200,
      "buyer_sku_code": "MLBB_86",
      "buyer_product_status": true,
      "seller_product_status": true,
      "unlimited_stock": true,
      "stock": 9999,
      "desc": "Top Up Diamond Mobile Legends Instan 1 Detik"
    }
  ]
}`;

const transactionRequest = `{
  "username": "top_partner_abc",
  "buyer_sku_code": "MLBB_86",
  "customer_no": "12345678(2001)",
  "ref_id": "INV-20260901-001",
  "sign": "md5(username + secret + ref_id)",
  "testing": false,
  "callback_url": "https://domain-partner.com/api/callback"
}`;

const transactionResponse = `{
  "data": {
    "ref_id": "INV-20260901-001",
    "customer_no": "12345678(2001)",
    "buyer_sku_code": "MLBB_86",
    "message": "Transaksi Sukses",
    "status": "Sukses",
    "rc": "00",
    "sn": "MLBB-1234567890123456",
    "price": 19200,
    "sign": "signature_callback"
  }
}`;

const curlSample = `curl -X POST ${BASE_URL}/api/v1/h2h/transaction \\
  -H "Content-Type: application/json" \\
  -d '${transactionRequest}'`;

const nodeSample = `const crypto = require("crypto");

const username = "YOUR_API_KEY";
const secretKey = "YOUR_SECRET_KEY";
const refId = "INV-" + Date.now();
const sign = crypto.createHash("md5")
  .update(username + secretKey + refId)
  .digest("hex");

const response = await fetch("${BASE_URL}/api/v1/h2h/transaction", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    username, buyer_sku_code: "MLBB_86",
    customer_no: "12345678(2001)", ref_id: refId,
    sign, testing: false,
    callback_url: "https://yourwebsite.com/api/callback"
  })
});
console.log(await response.json());`;

const phpSample = `<?php
$username = "YOUR_API_KEY";
$secretKey = "YOUR_SECRET_KEY";
$refId = "INV-" . time();
$sign = md5($username . $secretKey . $refId);

$payload = [
  "username" => $username,
  "buyer_sku_code" => "MLBB_86",
  "customer_no" => "12345678(2001)",
  "ref_id" => $refId,
  "sign" => $sign,
  "testing" => false,
  "callback_url" => "https://yourwebsite.com/api/callback"
];

$ch = curl_init("${BASE_URL}/api/v1/h2h/transaction");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$result = curl_exec($ch);`;

function CopyButton({ value, label = "Salin" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button onClick={copy} className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-white transition-colors" type="button">
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Tersalin" : label}
    </button>
  );
}

function CodeBlock({ title, value, tone = "text-slate-300" }: { title: string; value: string; tone?: string }) {
  return (
    <div className="space-y-2 min-w-0">
      <div className="flex items-center justify-between gap-3 text-xs font-bold text-slate-300">
        <span>{title}</span><CopyButton value={value} />
      </div>
      <pre className={`max-h-80 overflow-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-relaxed ${tone}`}>{value}</pre>
    </div>
  );
}

function ParameterTable({ params }: { params: Parameter[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="w-full min-w-[640px] text-left text-xs">
        <thead className="border-b border-slate-800 bg-slate-950 font-mono text-slate-400"><tr><th className="px-4 py-2.5">Field</th><th className="px-4 py-2.5">Tipe</th><th className="px-4 py-2.5">Wajib?</th><th className="px-4 py-2.5">Keterangan</th></tr></thead>
        <tbody className="divide-y divide-slate-800 text-slate-300">
          {params.map((param) => <tr key={param.field}><td className="px-4 py-2.5 font-mono text-indigo-300">{param.field}</td><td className="px-4 py-2.5 font-mono text-slate-400">{param.type}</td><td className={`px-4 py-2.5 font-medium ${param.required === "Ya" ? "text-emerald-400" : "text-slate-400"}`}>{param.required}</td><td className="px-4 py-2.5">{param.description}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}

function SectionTitle({ id, icon: Icon, title, description }: { id: string; icon: typeof BookOpen; title: string; description: string }) {
  return <div id={id} className="scroll-mt-24 border-b border-slate-800 pb-3"><h2 className="flex items-center gap-2 text-xl font-extrabold text-white"><Icon className="h-5 w-5 text-indigo-400" />{title}</h2><p className="mt-1 text-xs text-slate-400">{description}</p></div>;
}

function EndpointCard({ method = "POST", endpoint, alias, params, request, response }: { method?: string; endpoint: string; alias?: string; params?: Parameter[]; request: string; response: string }) {
  return (
    <div className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-5 md:p-6">
      <div className="flex flex-wrap items-center gap-2"><span className="rounded-lg border border-emerald-500/30 bg-emerald-500/20 px-3 py-1 font-mono text-xs font-bold text-emerald-400">{method}</span><code className="break-all text-sm font-bold text-white">{BASE_URL}{endpoint}</code>{alias && <span className="text-[11px] font-mono text-slate-400">(alias: {BASE_URL}{alias})</span>}</div>
      {params && <div className="space-y-2"><h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Parameter Body (JSON)</h3><ParameterTable params={params} /></div>}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2"><CodeBlock title="Contoh Request Body (JSON)" value={request} /><CodeBlock title="Contoh Response Sukses (200 OK)" value={response} tone="text-emerald-400" /></div>
    </div>
  );
}

export default function PublicDocsPage() {
  const [language, setLanguage] = useState<"node" | "php" | "curl">("node");
  const samples = { node: nodeSample, php: phpSample, curl: curlSample };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-200">
      <Navbar />
      <main className="flex-1 pt-24">
        <div className="mx-auto w-full max-w-6xl space-y-12 px-4 pb-20 md:px-6">
          <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 p-7 shadow-2xl md:p-10">
            <div className="pointer-events-none absolute -right-12 -top-12 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="relative space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/15 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-300"><BookOpen className="h-4 w-4" />Dokumentasi Resmi Reseller & H2H API v2.0</div>
              <h1 className="max-w-4xl text-3xl font-black leading-tight tracking-tight text-white md:text-5xl">Integrasi API Top-Up Game & Voucher IRXPlay</h1>
              <p className="max-w-3xl text-sm leading-relaxed text-slate-300">Dokumentasi publik konektivitas API Top-Up IRXPlay. Integrasikan website, aplikasi, bot, atau POS Anda untuk cek harga, cek saldo, transaksi otomatis, dan callback status real-time.</p>
              <div className="flex flex-wrap items-center gap-3 pt-3"><div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-2 font-mono text-xs"><span className="text-slate-500">BASE URL:</span><span className="font-bold text-indigo-400">{BASE_URL}/api/v1</span><CopyButton value={`${BASE_URL}/api/v1`} label="" /></div><span className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-400"><CheckCircle2 className="h-4 w-4" />Uptime Server 99.9% · Instan 1 Detik</span></div>
            </div>
          </section>

          <nav aria-label="Navigasi dokumentasi" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[{ href: "#auth", title: "Autentikasi", detail: "API Key & signature", icon: Lock }, { href: "#check-balance", title: "Cek Saldo", detail: "Sisa deposit", icon: Wallet }, { href: "#price-list", title: "Daftar Harga", detail: "SKU & harga", icon: Tag }, { href: "#transaction", title: "Transaksi", detail: "Order & callback", icon: Zap }].map(({ href, title, detail, icon: Icon }) => <a key={href} href={href} className="group rounded-2xl border border-slate-800 bg-slate-900 p-4 transition hover:-translate-y-0.5 hover:border-indigo-500/50"><Icon className="mb-2 h-5 w-5 text-indigo-400" /><h2 className="text-xs font-bold text-white group-hover:text-indigo-300">{title}</h2><p className="mt-1 text-[11px] text-slate-400">{detail}</p></a>)}
          </nav>

          <section className="space-y-6"><SectionTitle id="overview" icon={Layers} title="Alur Kerja Integrasi" description="Langkah memulai transaksi otomatis menggunakan API." /><div className="grid gap-4 md:grid-cols-4">{[["1", "Dapatkan API Key", "Login sebagai Member/Reseller dan buka menu API Key untuk memperoleh username serta secret key."], ["2", "Whitelist IP Server", "Daftarkan IP publik server Anda ke Admin. Request dari IP di luar whitelist ditolak."], ["3", "Isi Saldo Deposit", "Lakukan deposit melalui Dashboard. Saldo dipotong otomatis pada transaksi sukses."], ["4", "Kirim API & Callback", "Kirim order ke endpoint. Sistem akan memproses lalu mengirim callback saat status berubah."]].map(([number, title, description]) => <div key={number} className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-xs font-black text-white">{number}</span><h3 className="mt-3 text-sm font-bold text-white">{title}</h3><p className="mt-2 text-xs leading-relaxed text-slate-400">{description}</p></div>)}</div></section>

          <section className="space-y-6"><SectionTitle id="auth" icon={ShieldCheck} title="Autentikasi & Pembuatan Signature MD5" description="Keamanan payload menggunakan MD5 signature." /><div className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-5 md:p-6"><p className="text-xs leading-relaxed text-slate-300">Setiap request H2H wajib menyertakan <code className="font-bold text-amber-400">sign</code>. Jangan pernah menaruh Secret Key di frontend atau membagikannya ke pihak lain.</p><div className="grid gap-4 md:grid-cols-2"><div className="rounded-xl border border-slate-800 bg-slate-950 p-4"><p className="text-xs font-bold text-white">Transaksi & cek status</p><code className="mt-3 block rounded-lg border border-amber-500/20 bg-amber-500/10 p-2.5 text-xs font-bold text-amber-400">sign = md5(username + secret_key + ref_id)</code></div><div className="rounded-xl border border-slate-800 bg-slate-950 p-4"><p className="text-xs font-bold text-white">Cek saldo & daftar harga</p><code className="mt-3 block rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2.5 text-xs font-bold text-emerald-400">md5(username + secret_key + "depo")</code><code className="mt-2 block text-xs font-bold text-sky-400">md5(username + secret_key + "pricelist")</code></div></div><div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-4 text-xs text-indigo-100"><KeyRound className="mr-2 inline h-4 w-4 text-indigo-300" />Buat signature di server Anda; browser/client tidak boleh menyimpan Secret Key.</div></div></section>

          <section className="space-y-6"><SectionTitle id="check-balance" icon={Wallet} title="1. Cek Sisa Saldo Akun" description="Memeriksa saldo deposit yang tersedia untuk bertransaksi." /><EndpointCard endpoint="/api/v1/h2h/check-balance" alias="/v1/cek-saldo" params={balanceParams} request={balanceRequest} response={balanceResponse} /></section>
          <section className="space-y-6"><SectionTitle id="price-list" icon={Tag} title="2. Cek Daftar Harga & SKU Produk" description="Mengambil katalog aktif, buyer_sku_code, dan harga modal reseller." /><EndpointCard endpoint="/api/v1/h2h/price-list" alias="/v1/price-list" params={priceListParams} request={priceRequest} response={priceResponse} /></section>
          <section className="space-y-6"><SectionTitle id="transaction" icon={Zap} title="3. Melakukan Transaksi Top-Up" description="Mengeksekusi order item game atau voucher secara instan." /><EndpointCard endpoint="/api/v1/h2h/transaction" alias="/v1/transaction" params={transactionParams} request={transactionRequest} response={transactionResponse} /></section>
          <section className="space-y-6"><SectionTitle id="check-status" icon={RefreshCw} title="4. Cek Status Transaksi" description="Memeriksa status pesanan manual tanpa menunggu callback." /><EndpointCard endpoint="/api/v1/h2h/check-status" request={`{\n  "username": "top_partner_abc",\n  "ref_id": "INV-20260901-001",\n  "sign": "md5(username + secret + ref_id)"\n}`} response={transactionResponse} /></section>

          <section className="space-y-6"><SectionTitle id="webhook" icon={BellRing} title="5. Webhook Callback Real-Time" description="Format notifikasi yang dikirim ke server Anda ketika status order berubah." /><div className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-5 md:p-6"><p className="text-xs leading-relaxed text-slate-300">Apabila status awal <code className="text-amber-400">Pending</code>, IRXPlay akan mengirim HTTP <code className="font-bold text-emerald-400">POST</code> ke <code className="text-slate-100">callback_url</code> setelah pesanan berhasil atau gagal.</p><CodeBlock title="Payload JSON Callback" value={transactionResponse} tone="text-indigo-300" /><div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs"><h3 className="font-bold text-white">Ketentuan respons webhook</h3><ul className="mt-2 list-inside list-disc space-y-1.5 leading-relaxed text-slate-400"><li>Kembalikan HTTP <code className="text-emerald-400">200 OK</code> dengan body <code className="text-emerald-400">{`{"success": true}`}</code>.</li><li>Verifikasi callback dengan menghitung ulang <code className="text-amber-400">md5(username + secret + ref_id)</code> dan cocokkan dengan <code>data.sign</code>.</li><li>Selain respons 200 atau timeout lebih dari 10 detik akan dicoba ulang sampai 3 kali.</li></ul></div></div></section>

          <section className="space-y-6"><SectionTitle id="response-codes" icon={Hash} title="6. Tabel Response Code (RC)" description="Gunakan kode ini untuk logika transaksi pada sistem Anda." /><div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900"><table className="w-full min-w-[680px] text-left text-xs"><thead className="border-b border-slate-800 bg-slate-950 font-mono text-slate-400"><tr><th className="px-5 py-3">RC</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Penjelasan</th><th className="px-5 py-3">Saldo Deposit</th></tr></thead><tbody className="divide-y divide-slate-800 text-slate-300">{[["00", "Sukses", "Transaksi berhasil; serial number terbit.", "Terpotong", "text-emerald-400"], ["03", "Pending", "Sedang diproses. Tunggu callback atau cek status berkala.", "Terpotong sementara", "text-amber-400"], ["07", "Gagal", "Produk gangguan/cut-off atau SKU tidak ditemukan.", "Otomatis dikembalikan", "text-rose-400"], ["17", "Gagal", "Saldo deposit tidak mencukupi.", "Tidak terpotong", "text-rose-400"], ["40", "Gagal", "Signature, IP whitelist, atau parameter tidak valid.", "Tidak terpotong", "text-rose-400"]].map(([code, status, note, balance, color]) => <tr key={code}><td className={`px-5 py-3 text-sm font-black ${color}`}>{code}</td><td className="px-5 py-3 font-bold">{status}</td><td className="px-5 py-3">{note}</td><td className="px-5 py-3 text-slate-400">{balance}</td></tr>)}</tbody></table></div></section>

          <section className="space-y-6"><SectionTitle id="code-samples" icon={Code2} title="7. Contoh Kode Integrasi Siap Pakai" description="Pilih bahasa pemrograman lalu salin contoh transaksi H2H." /><div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 md:p-6"><div className="mb-4 flex flex-wrap gap-2">{(["node", "php", "curl"] as const).map((item) => <button key={item} type="button" onClick={() => setLanguage(item)} className={`rounded-lg px-3 py-2 text-xs font-bold transition ${language === item ? "bg-indigo-600 text-white" : "bg-slate-950 text-slate-400 hover:text-white"}`}>{item === "node" ? "Node.js" : item === "php" ? "PHP" : "cURL"}</button>)}</div><CodeBlock title={`Contoh ${language === "node" ? "Node.js" : language === "php" ? "PHP" : "cURL"}`} value={samples[language]} /><p className="mt-4 flex items-center gap-2 text-xs text-slate-400"><Server className="h-4 w-4 text-indigo-400" />Simpan API Key dan Secret Key hanya di environment variable server.</p></div></section>

          <section className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-6 text-center"><h2 className="text-lg font-bold text-white">Siap mulai integrasi?</h2><p className="mx-auto mt-2 max-w-2xl text-xs leading-relaxed text-slate-300">Buat akun member untuk mendapatkan API Key. Jika sudah terdaftar, buka dashboard untuk mengelola API key dan deposit.</p><div className="mt-4 flex flex-wrap justify-center gap-3"><Link href="/register" className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-500">Daftar Member</Link><Link href="/member/api-key" className="inline-flex items-center gap-1 rounded-xl border border-indigo-400/40 px-4 py-2.5 text-xs font-bold text-indigo-200 hover:bg-indigo-500/10">Kelola API Key <ExternalLink className="h-3.5 w-3.5" /></Link></div></section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
