# JSONBin Integration Setup

## Overview
Your Forex Trade Portfolio now uses **JSONBin.io** for global data persistence. All images uploaded via Cloudinary will have their URLs saved to JSONBin, making them visible across all devices.

## Required: Add Your JSONBin Master Key

Before testing, you need to add your JSONBin Master Key to the service file.

### Step 1: Get Your Master Key
1. Go to [https://jsonbin.io/api-keys](https://jsonbin.io/api-keys)
2. Copy your **Master Key** (it looks like: `$2a$10...`)

### Step 2: Add the Key to the Code
1. Open `js/jsonbin-service.js`
2. Find line 12:
   ```javascript
   const MASTER_KEY = '$2a$10$YOUR_MASTER_KEY_HERE';
   ```
3. Replace `$2a$10$YOUR_MASTER_KEY_HERE` with your actual Master Key
4. Save the file

## How It Works

### Data Flow
```
Admin Panel → Upload to Cloudinary → Get secure_url → Save to JSONBin → Global Storage
Main Page → Fetch from JSONBin → Display trades with images
```

### What Changed
- ✅ **Before**: Data stored in local `data/store.json` (device-specific)
- ✅ **After**: Data stored in JSONBin (globally accessible)

### Benefits
- 🌍 **Global Sync**: Changes appear on all devices immediately
- 📱 **Mobile Access**: Works on any device/browser
- 🔒 **Incognito Support**: No localStorage dependency
- ☁️ **Cloud Backup**: Data persisted in the cloud

## Testing Checklist

After adding your Master Key, test the following:

### Test 1: Admin Upload
1. Start server: `node server.js`
2. Go to `http://localhost:8123/admin`
3. Login with password: `admin123`
4. Upload a new trade with an image
5. Check browser console for: `✅ Trade saved to JSONBin globally`

### Test 2: Main Page Display
1. Go to `http://localhost:8123/`
2. The new trade should appear with the image
3. Check console for: `✅ Loaded X trades from JSONBin`

### Test 3: Cross-Device
1. Open the same URL in an **incognito window**
2. The trade should still appear (proving global storage)

### Test 4: Profile Photo
1. Upload a profile photo from the admin panel
2. It should appear in the navbar and hero section
3. Should persist across browser refreshes and incognito mode

## Deployment to Vercel

Your Express server will continue to work on Vercel. The only change is that data now comes from JSONBin instead of `data/store.json`.

No changes needed to your `vercel.json` configuration.

## Troubleshooting

### "Failed to save data to JSONBin"
- **Cause**: Master Key not configured or incorrect
- **Fix**: Double-check your Master Key in `jsonbin-service.js`

### "Failed to fetch data"
- **Cause**: Network issue or BIN_ID incorrect
- **Fix**: Verify BIN_ID is `6952d530d0ea881f40480352`

### Images don't appear
- **Cause**: Cloudinary upload succeeded but JSONBin save failed
- **Fix**: Check browser Network tab for JSONBin PUT request errors

## API Reference

### JSONBinService.fetchData()
Fetches the latest data from JSONBin (GET request).
Returns: `{ profile: {...}, trades: [...] }`

### JSONBinService.saveData(data)
Saves data to JSONBin (PUT request).
Parameter: `{ profile: {...}, trades: [...] }`

## Files Modified

- `js/jsonbin-service.js` (NEW) - JSONBin API client
- `js/admin.js` - Uses JSONBin for trade/profile uploads
- `js/main.js` - Uses JSONBin for data loading
- `server.js` - Documented legacy endpoints

## Next Steps

1. Add your Master Key to `jsonbin-service.js`
2. Test locally with the checklist above
3. Deploy to Vercel (no config changes needed)
4. All future uploads will be globally visible!
