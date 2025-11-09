// Test script to check if you can at least READ themes
fetch("https://n8dlab001.sharepoint.com/sites/BrandGuide/_api/brandcenter/GetSiteThemes", {
  "headers": {
    "accept": "application/json;odata.metadata=minimal",
    "cache-control": "no-cache"
  },
  "method": "GET",
  "mode": "cors",
  "credentials": "include"
})
.then(response => response.json())
.then(data => {
  console.log("Available site themes:", data);
})
.catch(error => {
  console.error("Error:", error);
});