| Phase | Technology | Goal |
| --- | --- | --- |
| 1 | PostgreSQL + Supabase | Database and authentication |
| 2 | React Registration | Public player registration |
| 3 | React Admin | Staff operations |
| 4 | Edge Functions | Registration and business workflows |
| 5 | React Client Portal | Parents and players log in to view their  |
| 6 | WordPress | Marketing website and SEO |
| 7 | Custom API (Render) | Only if Edge Functions become limiting |

A dedicated API becomes attractive when we have requirements like:
- third-party integrations
- versioned APIs
- higher performance needs
- long-running jobs
- multiple frontends consuming the same business layer
- wanting to move away from vendor-specific serverless functions

### System Context / Deployment
```
                        Public Website
                      (WordPress or similar)
                               │
                      [Links to React App]
                               │
            ┌──────────────────┴──────────────────┐
            │                                     │
    Registration Portal                     Client Portal
        (React)                                 (React)
            │                                     │
            └──────────────────┬──────────────────┘
                               │
                         Supabase Auth
                    (JWT / Authenticated Session)
                               │
            ┌──────────────────┴──────────────────┐
            │                                     │
      React Admin (Staff)                   Future Mobile App
            │
            ├───────────────┐
            │               │
    Supabase Client     Edge Functions
    (simple CRUD)       (business workflows)
            │               │
            └───────┬───────┘
                    │
            PostgreSQL (Supabase)
            (Tables / RLS / Functions)
```