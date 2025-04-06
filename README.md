# DocDoc Goose 🦢

A smart medication management app that helps users track, manage, and safely take their prescriptions. Built to address the critical need for better medication adherence, as nearly 70% of American adults take prescription medications and 50% don't take them as prescribed.

## Problem Statement

Medication non-adherence is a serious issue that can lead to severe consequences. Our app aims to reduce incidents like missed medications by providing:

- Timely medication reminders
- Easy medication tracking
- Barcode scanning for quick medication input
- FDA drug information integration
- AI-powered drug interaction warnings
- Secure blockchain-based data storage

## Project Structure

```
.
├── front-end/               # React Native Expo mobile application
│   ├── app/                # Application screens and navigation
│   ├── components/         # Reusable UI components
│   ├── contexts/          # React context providers
│   ├── api/               # API integration (OpenAI, FDA)
│   ├── assets/           # Static assets (images, fonts)
│   ├── constants/        # Application constants
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript type definitions
│   └── scripts/          # Build and utility scripts
│
├── upc_ndc_conversion/   # Barcode to NDC conversion utilities
│   ├── upc_ndc.ipynb    # Jupyter notebook for UPC-NDC processing
│   └── sample_data.json # Sample data for testing
│
└── Midnight/            # Blockchain implementation for secure data storage
```

## Features

- 📱 Modern React Native mobile app with intuitive UI
- 🔔 Medication reminders and scheduling
- 📸 Barcode scanning for easy medication input
- 🏥 FDA drug information integration
- 🤖 AI-powered drug interaction detection
- 🔒 Secure data storage using Midnight blockchain
- 🎨 Beautiful UI with RNUI components
- 💅 Styled with Nativewind
- 🦢 Interactive goose mascot

## Tech Stack

- **Frontend**: React Native Expo, RNUI, Nativewind
- **Backend**: Midnight Blockchain
- **AI/ML**: OpenAI API for drug interaction detection
- **Data**: FDA drug database integration
- **Security**: Midnight Lace Wallet, tDUST tokens
- **Design**: Figma


## Setup Instructions

### Frontend Setup

1. Navigate to the front-end directory:

   ```bash
   cd front-end
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm expo start
   ```

### Barcode Conversion Preprocessing

Finding a way to get medication information from barcodes was one of our first challenges. We were able to a dataset of 34,000+ medication barcode UPCs and NDCs (although the dataset is still incomplete). Using this, we created a mapping from UPCs to NDCs, and we able to query medication information from FDA endpoints using the NDCs.

1. Navigate to the upc_ndc_conversion directory:

   ```bash
   cd upc_ndc_conversion
   ```

2. Install Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Open the Jupyter notebooks:
   ```bash
   jupyter notebook
   ```

## Development

### Frontend Development

The frontend is built with React Native Expo and uses:

- TypeScript for type safety
- RNUI for UI components
- Nativewind for styling
- Expo for development and building

### Blockchain Integration

The app uses Midnight blockchain for:

- Secure data storage
- Token management via Midnight Lace Wallet
- Smart contract implementation

## Future Plans

- Interactive goose mascot animations
- OCR integration for medical document processing
- Enhanced LLM integration for document analysis
- Expanded drug interaction detection
- Improved medication scheduling features
