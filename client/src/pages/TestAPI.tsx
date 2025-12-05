import { trpc } from "@/lib/trpc";
import { useTranslation } from "react-i18next";
import SEOHead from "@/components/seo/SEOHead";

export default function TestAPI() {
  const { t } = useTranslation();
  const { data, isLoading, error } = trpc.dealers.getServiceCenters.useQuery();
  
  console.log("TRPC Query Result:", { data, isLoading, error });
  
  return (
    <div className="p-8">
      <SEOHead pageKey="testAPI" />
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      
      {data && (
        <div>
          <p className="mb-4">Found {data.length} service centers</p>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(data.slice(0, 3), null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
