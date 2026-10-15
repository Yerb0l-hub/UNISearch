# Complete UNISearch authentication setup

1. In the SQL Editor at
https://supabase.com/dashboard/project/lyxziyqrnlndnwvoturm/sql/new
run all SQL in `supabase-schema.sql` to create `student_profiles` and
protect each user's data with Row Level Security.

2. In Authentication > URL Configuration set:
- Site URL: `https://unisearch-student.vercel.app`
- Additional redirect: `https://unisearch-student.vercel.app/**`

3. In Supabase Authentication > Providers > Google, enable Google
and enter credentials from Google Cloud Console. In Google's OAuth
web client use the Supabase callback URL displayed by Supabase:
`https://lyxziyqrnlndnwvoturm.supabase.co/auth/v1/callback`.
Keep Google client secret *only* in the Supabase provider configuration.

4. Test email signup, confirmation, login, edit GPA/IELTS, refresh,
logout, separate accounts and Google OAuth. Only publish account
storage when these tests and RLS checks succeed.

The Supabase publishable key is intentionally used client-side.
Never put Postgres password or service-role key into browser files.
