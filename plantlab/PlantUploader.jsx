import React, { useRef, useState } from "react";
import { Upload, Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";

export default function PlantUploader({ onAnalyzed, analyzing, setAnalyzing }) {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const handleFile = async (file) => {
    if (!file) return;
    setError(null);
    setPreview(URL.createObjectURL(file));
    setAnalyzing(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      const { data } = await base44.functions.invoke("analyzePlantImage", { image_url: file_url });
      if (data.error) throw new Error(data.error);
      await base44.entities.PlantDiagnosis.create({ image_url: file_url, ...data.analysis });
      onAnalyzed({ image_url: file_url, ...data.analysis });
    } catch (e) {
      setError("Đã có lỗi khi phân tích ảnh này. Vui lòng thử một ảnh khác.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6 md:p-8">
      {preview ? (
        <div className="rounded-2xl overflow-hidden bg-slate-50 mb-5 aspect-video">
          <Image src={preview} alt="Uploaded plant" className="w-full h-full" fittingType="fit" />
        </div>
      ) : (
        <div className="rounded-2xl bg-emerald-50 border-2 border-dashed border-emerald-200 aspect-video mb-5 flex items-center justify-center text-emerald-500 text-sm">
          Chưa có ảnh — hãy tải lên ảnh lá hoặc cây để bắt đầu
        </div>
      )}

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          disabled={analyzing}
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 rounded-xl h-11"
        >
          {analyzing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
          Tải Ảnh Lên
        </Button>
        <Button
          disabled={analyzing}
          variant="outline"
          onClick={() => cameraInputRef.current?.click()}
          className="flex-1 rounded-xl h-11 border-emerald-200"
        >
          <Camera className="w-4 h-4 mr-2" />
          Chụp Ảnh
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}