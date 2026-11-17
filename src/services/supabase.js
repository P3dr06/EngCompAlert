import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qckdavzsyiccwitmrxhm.supabase.co';
const supabaseKey = 'sb_publishable_s5-fi9xZsbebALXGw96IqQ_DPprxsq2';

export const supabase = createClient(supabaseUrl, supabaseKey);
