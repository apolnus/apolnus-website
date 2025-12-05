import { useEffect, useState } from "react";

interface ResponsiveVideoProps {
  /** 影片檔名 (不含路徑和副檔名)，例如 "hero-video" */
  videoName: string;
  /** 影片所在目錄，預設為 "/videos" */
  basePath?: string;
  /** 額外的 CSS class */
  className?: string;
  /** 是否自動播放 */
  autoPlay?: boolean;
  /** 是否循環播放 */
  loop?: boolean;
  /** 是否靜音 */
  muted?: boolean;
  /** 是否顯示控制列 */
  controls?: boolean;
  /** 是否行內播放 (iOS需要) */
  playsInline?: boolean;
  /** poster 圖片路徑 */
  poster?: string;
}

/**
 * ResponsiveVideo 組件
 * 
 * 根據裝置螢幕大小自動載入不同解析度的影片：
 * - 手機版 (< 768px): 480p
 * - 平板版 (768px - 1024px): 720p
 * - 桌面版 (> 1024px): 1080p (原始檔案)
 * 
 * 影片檔案結構：
 * /videos/mobile/{videoName}.mp4
 * /videos/tablet/{videoName}.mp4
 * /videos/desktop/{videoName}.mp4
 */
export default function ResponsiveVideo({
  videoName,
  basePath = "/videos",
  className = "",
  autoPlay = true,
  loop = true,
  muted = true,
  controls = false,
  playsInline = true,
  poster,
}: ResponsiveVideoProps) {
  const [videoSrc, setVideoSrc] = useState<string>("");

  useEffect(() => {
    const updateVideoSource = () => {
      const width = window.innerWidth;
      let quality: "mobile" | "tablet" | "desktop";

      if (width < 768) {
        quality = "mobile";
      } else if (width < 1024) {
        quality = "tablet";
      } else {
        quality = "desktop";
      }

      const newSrc = `${basePath}/${quality}/${videoName}.mp4`;
      setVideoSrc(newSrc);
    };

    // 初始化載入
    updateVideoSource();

    // 監聽視窗大小變化
    window.addEventListener("resize", updateVideoSource);

    return () => {
      window.removeEventListener("resize", updateVideoSource);
    };
  }, [videoName, basePath]);

  if (!videoSrc) {
    return null;
  }

  return (
    <video
      key={videoSrc} // 強制重新載入影片
      className={className}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      controls={controls}
      playsInline={playsInline}
      poster={poster}
    >
      <source src={videoSrc} type="video/mp4" />
      您的瀏覽器不支援影片播放。
    </video>
  );
}
