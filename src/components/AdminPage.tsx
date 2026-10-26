import { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { Link2, Copy, MessageCircle, Heart } from 'lucide-react';
import { GROOM_NAME, BRIDE_NAME } from '../config';
import { PREFIXES, Prefix, buildDisplayName, buildInviteLink } from '../guest';

function buildMessage(displayName: string, link: string) {
  return `Dear ${displayName} ❤️

With joyful hearts, we warmly invite you to celebrate one of the most special days of our lives as we begin our journey together.

Please view our wedding invitation and all the event details through the link below 🌐:

${link}

Your presence would truly mean the world to us, and we would be honored to celebrate this beautiful moment together.

With love,
❤️ ${GROOM_NAME} & ${BRIDE_NAME}`;
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // Fallback for non-secure contexts where the Clipboard API is unavailable
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
}

export function AdminPage() {
  const [prefix, setPrefix] = useState<Prefix>('Mr.');
  const [guestName, setGuestName] = useState('');
  const [generated, setGenerated] = useState<{ displayName: string; link: string } | null>(null);

  const handleGenerate = () => {
    const displayName = buildDisplayName(prefix, guestName);
    if (!displayName) {
      toast.error('Please enter a guest name');
      return;
    }
    setGenerated({ displayName, link: buildInviteLink(window.location.origin, displayName) });
  };

  const handleCopyLink = async () => {
    if (!generated) return;
    await copyText(generated.link);
    toast.success('Link copied!');
  };

  const handleCopyMessage = async () => {
    if (!generated) return;
    await copyText(buildMessage(generated.displayName, generated.link));
    toast.success('Message copied!');
  };

  const inputClass =
    'w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#8B1E2F] focus:outline-none transition-colors bg-white';

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-rose-50/40 to-white px-4 py-12">
      <Toaster position="top-center" />
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <Heart className="w-10 h-10 mx-auto text-[#8B1E2F] mb-4" fill="#8B1E2F" />
          <h1 className="text-4xl font-serif text-[#5C0F1C] uppercase tracking-widest mb-2">
            Invitation Links
          </h1>
          <p className="text-gray-500 font-serif italic">
            {GROOM_NAME} &amp; {BRIDE_NAME} · Personalized invitations
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerate();
          }}
          className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border-2 border-[#8B1E2F]/20 space-y-6"
        >
          <div>
            <label className="block text-sm font-serif text-gray-700 mb-2">Select Prefix</label>
            <select value={prefix} onChange={(e) => setPrefix(e.target.value as Prefix)} className={inputClass}>
              {PREFIXES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-serif text-gray-700 mb-2">Guest Name</label>
            <input
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className={inputClass}
              placeholder="e.g. Sanjaya"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#8B1E2F] to-[#5C0F1C] text-white rounded-lg font-serif text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Link2 className="w-5 h-5" />
            Generate Link
          </button>

          {generated && (
            <div className="space-y-4 pt-2">
              <div className="rounded-lg bg-rose-50/60 border border-[#8B1E2F]/15 p-4">
                <p className="text-xs uppercase tracking-widest text-[#8B1E2F]/70 mb-2">Full Message</p>
                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-800">
                  {buildMessage(generated.displayName, generated.link)}
                </p>
              </div>
              <div className="rounded-lg bg-rose-50/60 border border-[#8B1E2F]/15 p-4">
                <p className="text-xs uppercase tracking-widest text-[#8B1E2F]/70 mb-1">Invitation Link</p>
                <a
                  href={generated.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-[#8B1E2F] underline break-all"
                >
                  {generated.link}
                </a>
              </div>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleCopyLink}
              disabled={!generated}
              className="py-3 rounded-lg border-2 border-[#8B1E2F] text-[#8B1E2F] font-serif hover:bg-[#8B1E2F]/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy Link Only
            </button>
            <button
              type="button"
              onClick={handleCopyMessage}
              disabled={!generated}
              className="py-3 rounded-lg border-2 border-[#8B1E2F] text-[#8B1E2F] font-serif hover:bg-[#8B1E2F]/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Copy Full Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
