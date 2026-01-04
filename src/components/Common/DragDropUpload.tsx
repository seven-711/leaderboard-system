import { useState, useRef } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import { cn } from "../../lib/utils";

interface DragDropUploadProps {
    value?: string;
    onFileSelect: (file: File) => void;
    label?: string;
}

export default function DragDropUpload({ value, onFileSelect, label = "Upload Image" }: DragDropUploadProps) {
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState<string | null>(value || null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        // Create local preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        onFileSelect(file);
    };

    const triggerInput = () => {
        inputRef.current?.click();
    };

    return (
        <div className="space-y-2">
            {label && <label className="block text-sm text-gray-400">{label}</label>}
            <div
                className={cn(
                    "relative group cursor-pointer flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed transition-all overflow-hidden",
                    dragActive
                        ? "border-[var(--color-neon-green)] bg-[var(--color-neon-green)]/10"
                        : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10",
                    preview ? "border-solid" : ""
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={triggerInput}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    onChange={handleChange}
                    accept="image/*"
                />

                {preview ? (
                    <>
                        <img src={preview} alt="Preview" className="w-full h-full object-contain p-2" />
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-sm font-medium flex items-center gap-2">
                                <Upload className="w-4 h-4" /> Change Image
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center text-center p-4 text-gray-400">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3">
                            <ImageIcon className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-medium text-white">Click or drag image here</p>
                        <p className="text-xs mt-1">PNG, JPG, GIF up to 5MB</p>
                    </div>
                )}
            </div>
        </div>
    );
}
