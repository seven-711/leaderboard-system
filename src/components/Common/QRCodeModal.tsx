import { X, QrCode } from "lucide-react";

interface QRCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    url: string;
}

export default function QRCodeModal({ isOpen, onClose, url }: QRCodeModalProps) {
    if (!isOpen) return null;

    // Using a public API for QR code generation to avoid heavy dependencies
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}&bgcolor=12-24-38&color=39-255-20`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[var(--color-dark-surface)] border border-[var(--color-neon-green)]/30 rounded-2xl p-8 max-w-sm w-full relative shadow-[0_0_50px_rgba(57,255,20,0.2)]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="flex flex-col items-center gap-6 text-center">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <QrCode className="w-6 h-6 text-[var(--color-neon-green)]" />
                        Scan to Follow
                    </h3>

                    <div className="p-4 bg-white rounded-xl">
                        {/* QR Server API returns an image. Note: Ideally use a library but this saves deps for now */}
                        <img src={qrImageUrl} alt="QR Code" className="w-48 h-48" />
                    </div>

                    <p className="text-sm text-gray-400">
                        Scan this code with your mobile device to view the live leaderboard instantly.
                    </p>
                </div>
            </div>
        </div>
    );
}
