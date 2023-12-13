%dw 2.0
input payload application/apex
output application/json
---
customers:
    customer: payload map(record) -> {
        Name  : record.Name,
        Address : {
            Street: record.BillingStreet,
            PostalCode : record.BillingPostalCode,
            City: record.BillingCity,
            Country: record.BillingCountry
        }
    }

