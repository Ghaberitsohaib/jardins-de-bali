// =========================================================================
// JARDINS DE BALI — SUPABASE CLOUD SYNC SERVICE (GRACEFUL OFFLINE FALLBACK)
// Syncs Accounts, Payments, Visits, and Chantier Progress with PostgreSQL
// =========================================================================

import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../config/supabase_config.dart';
import '../models/user_account_model.dart';

class CloudSnapshot {
  final List<UserAccount> accounts;
  final List<VisitBooking> visits;
  final ChantierProgress? chantier;

  const CloudSnapshot({
    required this.accounts,
    required this.visits,
    required this.chantier,
  });
}

class SupabaseSyncService {
  SupabaseClient? _client;
  String? _activeUrl;
  String? _lastError;

  bool get isConnected => _client != null;
  String? get activeUrl => _activeUrl;
  String? get lastError => _lastError;

  Future<bool> initialize({SupabaseConfig? overrideConfig}) async {
    final cfg = overrideConfig ?? await SupabaseConfig.load();
    if (!cfg.isConfigured) {
      _client = null;
      _activeUrl = null;
      return false;
    }

    try {
      _client?.dispose();
      _client = SupabaseClient(cfg.url, cfg.anonKey);
      _activeUrl = cfg.url;
      _lastError = null;
      await _client!.from('jdb_chantier').select('id').limit(1);
      return true;
    } catch (e) {
      _lastError = 'Connexion Supabase impossible : $e';
      debugPrint('SupabaseSyncService init error: $e');
      _client?.dispose();
      _client = null;
      _activeUrl = null;
      return false;
    }
  }

  void disconnect() {
    _client?.dispose();
    _client = null;
    _activeUrl = null;
    _lastError = null;
  }

  Future<CloudSnapshot?> pullAll() async {
    final client = _client;
    if (client == null) return null;
    try {
      final accRows = await client.from('jdb_accounts').select();
      final visitRows = await client
          .from('jdb_visits')
          .select()
          .order('created_at', ascending: false);
      final chantierRows =
          await client.from('jdb_chantier').select().eq('id', 1).limit(1);

      final accounts = (accRows as List).map((raw) {
        final m = Map<String, dynamic>.from(raw as Map);
        return UserAccount(
          id: m['id']?.toString() ?? '',
          email: m['email']?.toString() ?? '',
          password: m['password']?.toString() ?? '',
          name: m['name']?.toString() ?? '',
          phone: m['phone']?.toString() ?? '',
          role: m['role'] == 'admin' ? UserRole.admin : UserRole.client,
          assignedLotId: m['assigned_lot_id']?.toString(),
          financialProfile: m['financial_profile'] is Map
              ? ClientFinancialProfile.fromJson(
                  Map<String, dynamic>.from(m['financial_profile'] as Map),
                )
              : const ClientFinancialProfile(),
        );
      }).toList();

      final visits = (visitRows as List).map((raw) {
        final m = Map<String, dynamic>.from(raw as Map);
        return VisitBooking(
          id: m['id']?.toString() ?? '',
          userId: m['user_id']?.toString() ?? '',
          clientName: m['client_name']?.toString() ?? '',
          clientPhone: m['client_phone']?.toString() ?? '',
          date: m['date']?.toString() ?? '',
          timeSlot: m['time_slot']?.toString() ?? '',
          lotInterest: m['lot_interest']?.toString() ?? '',
          status: m['status']?.toString() ?? 'En attente',
          notes: m['notes']?.toString() ?? '',
        );
      }).toList();

      ChantierProgress? chantier;
      if ((chantierRows as List).isNotEmpty) {
        final c = Map<String, dynamic>.from(chantierRows.first as Map);
        chantier = ChantierProgress(
          progressPercent: (c['progress_percent'] as num?)?.toInt() ?? 68,
          currentPhase: c['current_phase']?.toString() ?? 'Gros œuvre & Façades',
          lastUpdate: c['last_update']?.toString() ?? '',
        );
      }

      _lastError = null;
      return CloudSnapshot(
        accounts: accounts,
        visits: visits,
        chantier: chantier,
      );
    } catch (e) {
      _lastError = 'Erreur synchronisation Supabase : $e';
      debugPrint('Supabase pullAll error: $e');
      return null;
    }
  }

  Future<void> upsertAccount(UserAccount acc) async {
    final client = _client;
    if (client == null) return;
    try {
      await client.from('jdb_accounts').upsert({
        'id': acc.id,
        'email': acc.email,
        'password': acc.password,
        'name': acc.name,
        'phone': acc.phone,
        'role': acc.role == UserRole.admin ? 'admin' : 'client',
        'assigned_lot_id': acc.assignedLotId,
        'financial_profile': acc.financialProfile.toJson(),
        'updated_at': DateTime.now().toIso8601String(),
      });
    } catch (e) {
      debugPrint('Supabase upsertAccount error: $e');
    }
  }

  Future<void> upsertVisit(VisitBooking v) async {
    final client = _client;
    if (client == null) return;
    try {
      await client.from('jdb_visits').upsert({
        'id': v.id,
        'user_id': v.userId,
        'client_name': v.clientName,
        'client_phone': v.clientPhone,
        'date': v.date,
        'time_slot': v.timeSlot,
        'lot_interest': v.lotInterest,
        'status': v.status,
        'notes': v.notes,
      });
    } catch (e) {
      debugPrint('Supabase upsertVisit error: $e');
    }
  }

  Future<void> upsertChantier(ChantierProgress c) async {
    final client = _client;
    if (client == null) return;
    try {
      await client.from('jdb_chantier').upsert({
        'id': 1,
        'progress_percent': c.progressPercent,
        'current_phase': c.currentPhase,
        'last_update': c.lastUpdate,
      });
    } catch (e) {
      debugPrint('Supabase upsertChantier error: $e');
    }
  }
}
