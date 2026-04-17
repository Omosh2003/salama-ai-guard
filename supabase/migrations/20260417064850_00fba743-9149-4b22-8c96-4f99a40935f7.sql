ALTER TABLE public.threats REPLICA IDENTITY FULL;
ALTER TABLE public.alerts REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.threats;
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;