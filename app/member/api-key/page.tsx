"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Key, ArrowLeft, Copy, Check, RefreshCw, ShieldAlert, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { generateAPIKey } from '@/lib/api';
import { toast } from 'sonner';

export default function ResellerApiKeyPage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshUser } = useAuth();

  const [webhookUrl, setWebhookUrl] = useState<string>(user?.webhook_url || '');
  const [apiKey, setApiKey] = useState<string>(user?.api_key || '');
  const [copied, setCopied] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await generateAPIKey(webhookUrl);
    setSubmitting(false);

    if (res.success && res.data) {
      setApiKey(res.data);
      toast.success('API Key berhasil dibuat!');
      refreshUser();
    } else {
      toast.error(res.message || 'Gagal membuat API key.');
    }
  };

  const copyToClipboard = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('API Key disalin ke papan klip!');
  };

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          
          <button
            onClick={() => router.push('/member')}
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard
          </button>

          <div className="bg-card/90 border border-border/80 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
              <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400">
                <Key className="h-6 w-6" />
              </div>
              <div>
                <h1 className="font-gaming text-xl font-bold text-foreground">API Key Reseller / H2H</h1>
                <p className="text-xs text-muted-foreground">Kredensial integrasi Host to Host (H2H) Digiflazz Seller API.</p>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-xs text-amber-300 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-amber-400">
                <ShieldAlert className="h-4 w-4" /> Perhatian Keamanan:
              </span>
              <p className="leading-relaxed">
                Jaga kerahasiaan API Key Anda. Jangan pernah membagikan API key kepada siapapun. API key digunakan untuk melakukan transaksi otomatis memotong saldo akun Anda.
              </p>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">Webhook URL Callback (Opsional)</label>
                <input
                  type="url"
                  placeholder="https://domain-anda.com/api/callback"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full bg-muted/50 border border-border/60 rounded-xl px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan-500"
                />
              </div>

              {apiKey && (
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">API Key Aktif Anda</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={apiKey}
                      className="w-full bg-muted border border-border/80 rounded-xl px-4 py-3 text-xs font-mono font-bold text-cyan-400 focus:outline-none select-all"
                    />
                    <button
                      type="button"
                      onClick={copyToClipboard}
                      className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all shrink-0"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:shadow-lg hover:shadow-cyan-500/30 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> Generasi...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> {apiKey ? 'Regenerasi API Key Baru' : 'Generate API Key'}
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
