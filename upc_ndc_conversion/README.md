# Barcode to Drug Information Converter

A utility component of DocDoc Goose that converts medication barcodes (UPC) to National Drug Codes (NDC) and retrieves detailed drug information from the FDA database.

## Overview

This component is crucial for DocDoc Goose's medication scanning feature, providing:

- Barcode to NDC conversion for easy medication input
- Integration with FDA drug database
- Detailed drug information retrieval
- Support for medication conflict detection

## Purpose

When users scan a medication barcode, this utility:

1. Converts the barcode (UPC) to its corresponding NDC
2. Retrieves detailed drug information from the FDA
3. Provides data for AI-powered drug interaction analysis
4. Helps populate medication information automatically

## Files

- `upc_ndc.ipynb`: Main converter for barcode to NDC
- `upc_ndc_label.ipynb`: Processor for FDA drug label data
- `sample_data.json`: Sample drug data for testing
- `upc_ndc_mapping.txt`: Master barcode-to-NDC mapping
- `upc_ndc_label_mapping.txt`: Extended mapping with drug details

## Setup

1. Install required Python packages:

   ```bash
   pip install pandas numpy jupyter requests
   ```

2. Start Jupyter Notebook:

   ```bash
   jupyter notebook
   ```

3. Open either notebook to begin processing

## Usage

### Basic Barcode to NDC Conversion

```python
import pandas as pd

# Load the mapping file
mapping_df = pd.read_csv('upc_ndc_mapping.txt', sep='|')

# Convert a barcode to NDC
barcode = "1234567890"
ndc = mapping_df[mapping_df['UPC'] == barcode]['NDC'].iloc[0]
```

### Retrieving Drug Information

```python
import json
import requests

# Load drug label data
with open('sample_data.json', 'r') as f:
    drug_data = json.load(f)

# Extract drug information
ndc = drug_data.get('openfda', {}).get('package_ndc', [])[0]
drug_name = drug_data.get('openfda', {}).get('brand_name', ['Unknown'])[0]
generic_name = drug_data.get('openfda', {}).get('generic_name', ['Unknown'])[0]

# Get detailed drug information from FDA
fda_url = f"https://api.fda.gov/drug/label.json?search=openfda.package_ndc:{ndc}"
response = requests.get(fda_url)
detailed_info = response.json()
```

## Data Formats

### Mapping File Format

```
UPC|NDC|PRODUCT_NAME|GENERIC_NAME
123456789012|12345-678-90|Brand Drug Name|Generic Drug Name
```

### Drug Information JSON Format

```json
{
  "openfda": {
    "upc": ["123456789012"],
    "package_ndc": ["12345-678-90"],
    "brand_name": ["Brand Drug Name"],
    "generic_name": ["Generic Drug Name"],
    "route": ["ORAL"],
    "dosage_form": ["TABLET"]
  },
  "dosage_and_administration": ["Take one tablet daily"],
  "warnings": ["Common side effects include..."]
}
```

## Integration with DocDoc Goose

This utility is used by the mobile app to:

1. Process scanned medication barcodes
2. Retrieve accurate drug information
3. Support medication scheduling
4. Enable drug interaction checking
5. Provide detailed medication information to users

## Contributing

When contributing:

1. Test with various barcode formats
2. Validate FDA data integration
3. Update sample data as needed
4. Document any API changes
5. Ensure error handling for invalid barcodes

## Notes

- Barcodes should be clear and complete for accurate scanning
- NDC codes follow the format xxxxx-xxxx-xx
- FDA API rate limits apply
- Some medications may have multiple barcodes or NDCs
- Always validate drug information with healthcare providers

## Resources

- [FDA Drug API Documentation](https://open.fda.gov/apis/drug/)
- [NDC Directory](https://www.fda.gov/drugs/drug-approvals-and-databases/national-drug-code-directory)
- [UPC Database](https://www.gs1.org/standards/barcodes)
