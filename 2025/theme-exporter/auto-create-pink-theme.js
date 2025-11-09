// Automatically get fresh digest and create the theme
async function createPinkTextTheme() {
  try {
    console.log("Getting fresh request digest...");
    
    // Step 1: Get fresh request digest
    const digestResponse = await fetch("/_api/contextinfo", {
      method: "POST",
      headers: {
        "Accept": "application/json;odata=verbose",
        "Content-Type": "application/json;charset=utf-8"
      },
      credentials: "include"
    });
    
    const digestData = await digestResponse.json();
    const freshDigest = digestData.d.GetContextWebInformation.FormDigestValue;
    
    console.log("Fresh digest obtained:", freshDigest.substring(0, 20) + "...");
    
    // Step 2: Create the theme with fresh digest
    console.log("Creating Pink Text Only Theme...");
    
    const themeResponse = await fetch("https://n8dlab001.sharepoint.com/sites/BrandGuide/_api/brandcenter/AddTenantTheme", {
      method: "POST",
      headers: {
        "accept": "application/json;odata.metadata=minimal",
        "accept-language": "en-US,en;q=0.9,de;q=0.8",
        "cache-control": "no-cache",
        "content-type": "application/json;charset=utf-8",
        "odata-version": "4.0",
        "pragma": "no-cache",
        "priority": "u=1, i",
        "sdkversion": "SPFx/brand-center/08e9269f-c592-453a-a154-47bc847577e5/Is3PRequest:0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requestdigest": freshDigest
      },
      referrer: "https://n8dlab001.sharepoint.com/sites/brandguide/_layouts/15/brandcenter.aspx/sharepoint/themes/create",
      mode: "cors",
      credentials: "include",
      body: JSON.stringify({
        "themeData": {
          "name": "Pink Text Only Theme",
          "themeJson": JSON.stringify({
            "name": "Pink Text Only Theme",
            "isInverted": false,
            "palette": {
              "themeDarker": "#666666",
              "themeDark": "#777777",
              "themeDarkAlt": "#888888",
              "themePrimary": "#999999",
              "themeSecondary": "#aaaaaa",
              "themeTertiary": "#bbbbbb",
              "themeLight": "#cccccc",
              "themeLighter": "#dddddd",
              "themeLighterAlt": "#eeeeee",
              "black": "#000000",
              "neutralDark": "#201f1e",
              "neutralPrimary": "#ff1eb5",
              "neutralPrimaryAlt": "#323130",
              "neutralSecondary": "#605e5c",
              "neutralTertiary": "#a19f9d",
              "neutralTertiaryAlt": "#c8c6c4",
              "neutralLight": "#edebe9",
              "neutralLighter": "#f3f2f1",
              "neutralLighterAlt": "#faf9f8",
              "white": "#ffffff",
              "neutralQuaternaryAlt": "#e1dfdd",
              "neutralQuaternary": "#d0d0d0",
              "backgroundColor": "#ffffff"
            },
            "displayMode": "light",
            "secondaryColors": {
              "light": [{
                "themePrimary": "#ffffff",
                "backgroundColor": "#999999"
              }],
              "dark": []
            }
          }),
          "isVisible": true,
          "source": 1
        }
      })
    });
    
    if (themeResponse.ok) {
      const result = await themeResponse.json();
      console.log("✅ Theme created successfully!", result);
      console.log("🎨 Theme ID:", result.id);
      console.log("📝 Theme Name:", result.name);
    } else {
      const errorText = await themeResponse.text();
      console.error("❌ Failed to create theme:", themeResponse.status, errorText);
    }
    
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// Execute the function
createPinkTextTheme();