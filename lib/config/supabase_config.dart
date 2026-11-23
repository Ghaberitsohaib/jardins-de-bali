// =========================================================================
// JARDINS DE BALI — SUPABASE CLOUD CONFIGURATION
// Supports compile-time --dart-define OR runtime Admin configuration
// =========================================================================

import 'package:shared_preferences/shared_preferences.dart';

class SupabaseConfig {
  static const String _prefUrlKey = 'jdb_supabase_url_v1';
  static const String _prefAnonKey = 'jdb_supabase_anon_key_v1';

  // Optional compile-time injection:
  // flutter build web --dart-define=SUPABASE_URL=... --dart-define=SUPABASE_ANON_KEY=...
  static const String envUrl = String.fromEnvironment('SUPABASE_URL');
  static const String envAnonKey = String.fromEnvironment('SUPABASE_ANON_KEY');

  final String url;
  final String anonKey;

  const SupabaseConfig({
    required this.url,
    required this.anonKey,
  });

  bool get isConfigured =>
      url.trim().startsWith('https://') && anonKey.trim().length > 20;

  static Future<SupabaseConfig> load() async {
    if (envUrl.trim().isNotEmpty && envAnonKey.trim().isNotEmpty) {
      return SupabaseConfig(url: envUrl.trim(), anonKey: envAnonKey.trim());
    }
    final prefs = await SharedPreferences.getInstance();
    return SupabaseConfig(
      url: (prefs.getString(_prefUrlKey) ?? '').trim(),
      anonKey: (prefs.getString(_prefAnonKey) ?? '').trim(),
    );
  }

  static Future<void> save(String url, String anonKey) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_prefUrlKey, url.trim());
    await prefs.setString(_prefAnonKey, anonKey.trim());
  }

  static Future<void> clear() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_prefUrlKey);
    await prefs.remove(_prefAnonKey);
  }
}
