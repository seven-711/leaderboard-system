import { X, QrCode } from "lucide-react";
import QRCode from "react-qr-code";

interface QRCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    url: string;
}

export default function QRCodeModal({ isOpen, onClose, url }: QRCodeModalProps) {
    if (!isOpen) return null;

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
                        <div style={{ height: "auto", margin: "0 auto", maxWidth: 200, width: "100%" }}>
                            <QRCode
                                size={256}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                value={url}
                                viewBox={`0 0 256 256`}
                            />
                        </div>
                    </div>

                    <p className="text-sm text-gray-400">
                        Scan this code with your mobile device to view the live leaderboard instantly.
                    </p>
                </div>
            </div>
        </div>
    );
}
