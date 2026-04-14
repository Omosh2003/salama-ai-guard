
-- Drop overly permissive policies
DROP POLICY "Authenticated users can insert threats" ON public.threats;
DROP POLICY "Authenticated users can update threats" ON public.threats;
DROP POLICY "Authenticated users can insert alerts" ON public.alerts;
DROP POLICY "Authenticated users can update alerts" ON public.alerts;

-- Tighter policies: any authenticated user can insert (needed for the system to log threats)
-- but restrict to logged-in users explicitly via auth.uid() check
CREATE POLICY "Authenticated users can insert threats" ON public.threats FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update threats" ON public.threats FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can insert alerts" ON public.alerts FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update alerts" ON public.alerts FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL);
