# Store Locator

A simple web application that allows users to find store locations by entering a store number. The app fetches store data from a JSON file and displays the results in a user-friendly interface.

## Features

- Search for stores by entering a store number.
- Displays store details including Store ID, Store Type, and Country.
- Responsive design for both desktop and mobile users.
- Loading indicator while searching for stores.

## Technologies Used

- **HTML**
- **CSS**
- **JavaScript**
- **Fetch API** for data retrieval

## Sample Data Generation

To populate the application with store data, a sample dataset was generated using the Pandas library in Python. Below is a brief overview of how the data was created.

### Data Generation Process

1. **Locations**: A predefined list of countries was used.
2. **Store IDs**: Unique identifiers were randomly generated.
3. **JSON Output**: The data was saved in JSON format for easy retrieval.

### Python Code Snippet

```python
import pandas as pd
import random

# Sample locations
locations = [
    "United States", "Canada", "Spain", "Germany", 
    "Italy", "France", "United Kingdom", "Australia"
]

# Function to generate sample data
def generate_sample_data(num_stores):
    store_ids = [f"S{random.randint(3000000, 9999999)}" for _ in range(num_stores)]
    location_choices = random.choices(locations, k=num_stores)
    sample_data = pd.DataFrame({"store_id": store_ids, "location": location_choices})
    return sample_data

# Create and save sample data
sample_data = generate_sample_data(100)
sample_data.to_json("sample_data.json", orient="records", lines=True)
```

## Conclusion

This application provides an easy way for users to find store locations, making use of modern web technologies and a dynamically generated dataset. Feel free to explore and modify the code for your own needs.
