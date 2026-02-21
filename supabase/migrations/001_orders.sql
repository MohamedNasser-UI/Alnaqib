-- Orders: one row per checkout (guest). Payment status updated by Paymob callback.
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  address text not null,
  governorate text not null,
  mobile text not null,
  total_egp numeric not null,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed')),
  paymob_order_id text,
  paymob_transaction_id text,
  locale text not null default 'en'
);

-- Order items: one row per product size in the order.
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_slug text not null,
  product_name_ar text not null,
  product_name_en text not null,
  size_ml int not null,
  quantity int not null,
  price_egp numeric not null
);

create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_orders_payment_status on public.orders(payment_status);
create index if not exists idx_order_items_order_id on public.order_items(order_id);

-- RLS: allow service role full access; no anon access from client for orders.
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "Service role full access orders" on public.orders
  for all using (true) with check (true);

create policy "Service role full access order_items" on public.order_items
  for all using (true) with check (true);
