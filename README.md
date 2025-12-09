# Free365Key - Microsoft 365 License Giveaway Site

A lead generation website for Microsoft 365 licensing, built for Azure Static Web Apps.

## Features

- User registration form with extended data collection
- Random winner selection system
- Admin dashboard with CSV export
- Ad placement support
- Privacy policy and terms of service pages

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Azure Functions (Node.js)
- **Database**: Azure Table Storage
- **Hosting**: Azure Static Web Apps

## Local Development

### Prerequisites

- Node.js 18+
- Azure Functions Core Tools v4
- Azurite (for local storage emulation)

### Setup

1. Install dependencies:
   ```bash
   npm install
   cd api && npm install && cd ..
   ```

2. Start Azurite for local storage:
   ```bash
   azurite --silent
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. In a separate terminal, start Azure Functions:
   ```bash
   cd api && func start
   ```

## Deployment to Azure

### 1. Create Azure Resources

```bash
# Create resource group
az group create --name rg-free365key --location eastus

# Create storage account (for Table Storage)
az storage account create \
  --name stfree365key \
  --resource-group rg-free365key \
  --location eastus \
  --sku Standard_LRS

# Create Static Web App
az staticwebapp create \
  --name free365key \
  --resource-group rg-free365key \
  --location eastus2
```

### 2. Configure Secrets

1. Get your Static Web Apps deployment token from Azure Portal
2. Add it as `AZURE_STATIC_WEB_APPS_API_TOKEN` in GitHub repository secrets

### 3. Configure Application Settings

In Azure Portal, add these application settings to your Static Web App:

- `STORAGE_CONNECTION_STRING`: Your Azure Storage connection string
- `ADMIN_PASSWORD`: A strong password for admin access

### 4. Deploy

Push to the `main` branch - GitHub Actions will automatically deploy.

## Admin Access

Navigate to `/admin` and enter your admin password to:
- View all registrations
- Export data to CSV
- Select random winners

## Ad Integration

The `AdBanner` component is set up for ad integration. To add Google AdSense:

1. Add the AdSense script to `index.html`:
   ```html
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXX" crossorigin="anonymous"></script>
   ```

2. Update `src/components/AdBanner.jsx` with your ad unit code

## Environment Variables

### Frontend (Vite)
- None required for production

### Backend (Azure Functions)
- `STORAGE_CONNECTION_STRING`: Azure Storage connection string
- `ADMIN_PASSWORD`: Admin panel password

## Security Notes

- Admin authentication is basic password-based - consider upgrading for production
- Enable CORS restrictions in production
- Review CSP headers in `staticwebapp.config.json`
- Keep `local.settings.json` out of version control
