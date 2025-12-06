import { useTranslation } from "react-i18next";
import { useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { APP_LOGO } from "@/const";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function Login() {
  const { t } = useTranslation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const redirect = params.get("redirect") || "/";
  const encodedRedirect = encodeURIComponent(redirect);

  // Error handling
  const error = params.get("error");
  const errorMessage = params.get("message");
  const errorCode = params.get("code");
  const message = params.get("message");

  // Display error message
  const getErrorDisplay = () => {
    if (message === 'logged_out') {
      return (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-green-800">{t('auth.logged_out') || '已成功登出'}</p>
        </div>
      );
    }

    if (!error) return null;

    const errorMessages: Record<string, string> = {
      'google_failed': t('auth.error.google_failed') || 'Google 登入失敗',
      'line_failed': t('auth.error.line_failed') || 'LINE 登入失敗',
      'google_init_failed': t('auth.error.google_init_failed') || 'Google 登入初始化失敗',
      'line_init_failed': t('auth.error.line_init_failed') || 'LINE 登入初始化失敗',
      'logout_failed': t('auth.error.logout_failed') || '登出失敗',
    };

    const displayMessage = errorMessages[error] || t('auth.error.unknown') || '認證失敗，請重試';
    const detailMessage = errorMessage ? decodeURIComponent(errorMessage) : null;

    return (
      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">{displayMessage}</p>
            {detailMessage && (
              <p className="text-xs text-red-600 mt-1">{detailMessage}</p>
            )}
            {errorCode && errorCode !== 'unknown' && (
              <p className="text-xs text-red-500 mt-1">錯誤代碼: {errorCode}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/product-living-room.jpeg"
          className="w-full h-full object-cover"
          alt="Background"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <img src={APP_LOGO} alt="Logo" className="h-8 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('auth.title')}</h1>
          <p className="text-sm text-gray-500 mb-8">{t('auth.subtitle')}</p>

          {/* Error/Success Messages */}
          {getErrorDisplay()}

          <div className="space-y-4">
            {/* Google */}
            <a href={`/api/auth/google?redirect=${encodedRedirect}`} className="block">
              <Button
                variant="outline"
                className="w-full h-12 text-base font-normal border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-3"
              >
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="w-5 h-5"
                />
                {t('auth.google')}
              </Button>
            </a>

            {/* LINE */}
            <a href={`/api/auth/line?redirect=${encodedRedirect}`} className="block">
              <Button
                className="w-full h-12 text-base font-normal bg-[#06C755] hover:bg-[#05b34c] text-white flex items-center justify-center gap-3 border-none"
              >
                {/* SVG Icon for LINE */}
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M22.3 11.7c0-5.1-4.6-9.3-10.3-9.3S1.7 6.6 1.7 11.7c0 4.6 3.7 8.4 8.7 9.1.3 0 .8.1.9-.2.1-.2.1-.5 0-.8-.1-.4-.3-1.3-.4-1.9 0 0-.1-.4.2-.6.4-.2 2.1 1.2 5.1 1.2 5.7 0 10.3-4.2 10.3-9.3zm-10.3 7.1c-4.4 0-8-3.2-8-7.1s3.6-7.1 8-7.1 8 3.2 8 7.1-3.6 7.1-8 7.1z" />
                </svg>
                {t('auth.line')}
              </Button>
            </a>
          </div>

          <p className="mt-8 text-xs text-gray-400 px-8 leading-relaxed">
            {t('auth.privacy')}
          </p>
        </div>
      </div>
    </div>
  );
}

