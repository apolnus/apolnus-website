import { getAllSeoSettings } from "../server/seo.js";

console.log("Testing SEO API...");

try {
  const settings = await getAllSeoSettings();
  console.log(`✅ Successfully fetched ${settings.length} SEO settings`);
  
  if (settings.length > 0) {
    console.log("\nFirst 3 settings:");
    settings.slice(0, 3).forEach((setting, index) => {
      console.log(`\n${index + 1}. Page: ${setting.page}, Language: ${setting.language}`);
      console.log(`   Title: ${setting.title}`);
      console.log(`   Description: ${setting.description?.substring(0, 50)}...`);
    });
  }
} catch (error) {
  console.error("❌ Error fetching SEO settings:", error.message);
  process.exit(1);
}
