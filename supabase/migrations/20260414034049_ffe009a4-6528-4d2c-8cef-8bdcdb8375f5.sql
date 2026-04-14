
-- Create enums
CREATE TYPE public.threat_severity AS ENUM ('critical', 'high', 'medium', 'low', 'info');
CREATE TYPE public.threat_status AS ENUM ('active', 'investigating', 'resolved', 'dismissed');
CREATE TYPE public.org_type AS ENUM ('university', 'government', 'sme');
CREATE TYPE public.app_role AS ENUM ('admin', 'analyst', 'viewer');

-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Organizations table
CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type org_type NOT NULL DEFAULT 'university',
  status TEXT NOT NULL DEFAULT 'protected',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view organizations" ON public.organizations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert organizations" ON public.organizations FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update organizations" ON public.organizations FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Organization members
CREATE TABLE public.organization_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, user_id)
);
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own memberships" ON public.organization_members FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage memberships" ON public.organization_members FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Threats table
CREATE TABLE public.threats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  source TEXT NOT NULL,
  target TEXT NOT NULL,
  severity threat_severity NOT NULL DEFAULT 'medium',
  description TEXT,
  status threat_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.threats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view threats" ON public.threats FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert threats" ON public.threats FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update threats" ON public.threats FOR UPDATE TO authenticated USING (true);
CREATE TRIGGER update_threats_updated_at BEFORE UPDATE ON public.threats FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_threats_severity ON public.threats(severity);
CREATE INDEX idx_threats_status ON public.threats(status);
CREATE INDEX idx_threats_created_at ON public.threats(created_at DESC);

-- Alerts table
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  threat_id UUID REFERENCES public.threats(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  message TEXT,
  severity threat_severity NOT NULL DEFAULT 'medium',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view alerts" ON public.alerts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert alerts" ON public.alerts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update alerts" ON public.alerts FOR UPDATE TO authenticated USING (true);
CREATE INDEX idx_alerts_created_at ON public.alerts(created_at DESC);
CREATE INDEX idx_alerts_is_read ON public.alerts(is_read);

-- Phishing scans table
CREATE TABLE public.phishing_scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  input_text TEXT NOT NULL,
  input_type TEXT NOT NULL DEFAULT 'text',
  risk_score NUMERIC(5,2),
  risk_level threat_severity,
  analysis JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.phishing_scans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own scans" ON public.phishing_scans FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scans" ON public.phishing_scans FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_phishing_scans_user_id ON public.phishing_scans(user_id);
CREATE INDEX idx_phishing_scans_created_at ON public.phishing_scans(created_at DESC);
