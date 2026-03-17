# Logical ERD

```mermaid
erDiagram
  MenuItem ||--o{ OrderLine : "referenced by"
  Order ||--o{ OrderLine : "contains"

  MenuItem {
    string id PK
    string name
    string description
    string category
    float price
    string dietary[]  "JSON array"
    string addOns[]   "JSON array of {id,label,price}"
    int stock
    bool available
    int prepMinutes
    string imageUrl
  }

  Order {
    string id PK
    string status
    float subtotal
    float tax
    float total
    string customer JSON
    string paymentRef
    bool priceChanged
    int version
    datetime createdAt
    datetime updatedAt
  }

  OrderLine {
    string menuItemId FK
    int quantity
    string addOnIds[] "JSON array of selected add-ons"
    float unitPrice
    float addOnTotal
    string specialInstructions
  }
```

**Events:** Socket.IO broadcasts `order.updated` (per-order room) and `admin.orders` (all orders) on status/creation changes.
