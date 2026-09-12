-- DARIK_STOREFRONT_BANNER_GENERATOR_274
-- Private server-managed banner records. Public reads go through Darik's server API.

create table if not exists public.retailer_storefront_banners (
  id uuid primary key default gen_random_uuid(),
  storefront_id uuid not null,
  retailer_id uuid not null,
  banner_text text not null,
  ai_prompt text,
  hero_size_generated_for text not null default 'default',
  background_image_url text not null,
  final_banner_image_url text not null,
  status text not null default 'draft',
  credits_charged integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint retailer_storefront_banners_hero_size_check
    check (hero_size_generated_for in ('default', 'compact')),
  constraint retailer_storefront_banners_status_check
    check (status in ('draft', 'active', 'archived')),
  constraint retailer_storefront_banners_text_length_check
    check (char_length(banner_text) between 3 and 120),
  constraint retailer_storefront_banners_credit_check
    check (credits_charged >= 0)
);

create index if not exists retailer_storefront_banners_storefront_created_idx
  on public.retailer_storefront_banners (storefront_id, created_at desc);

create index if not exists retailer_storefront_banners_retailer_created_idx
  on public.retailer_storefront_banners (retailer_id, created_at desc);

create unique index if not exists retailer_storefront_banners_one_active_idx
  on public.retailer_storefront_banners (storefront_id)
  where status = 'active';

alter table public.retailer_storefront_banners enable row level security;

revoke all on table public.retailer_storefront_banners from anon, authenticated;
grant all on table public.retailer_storefront_banners to service_role;

comment on table public.retailer_storefront_banners is
  'Darik AI storefront promotional banners. Managed by server routes; one active banner per storefront.';
