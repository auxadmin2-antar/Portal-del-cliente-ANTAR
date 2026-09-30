import { buildEnvironment } from './env.mjs';
import { readSiteConfig } from '../src/config/site.ts';
import { readSupabaseConfig, backendRequired } from '../src/config/supabase.schema.ts';
import { readKycConfig } from '../src/config/kyc.schema.ts';

const env = buildEnvironment();
const site = readSiteConfig(env);
if (backendRequired(env.SUPABASE_REQUIRED) || env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) readSupabaseConfig(env);
// Production must deliver real email and verify the captcha; other environments validate at runtime.
if (env.VERCEL_ENV === 'production') readKycConfig(env);
console.log('Build configuration OK; search indexing: ' + (site.indexable ? 'enabled' : 'disabled'));
