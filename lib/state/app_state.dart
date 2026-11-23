// =========================================================================
// JARDINS DE BALI — GLOBAL APP STATE (PRESENTATION ONLY • PRIX SUR DEMANDE)
// =========================================================================

import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../config/supabase_config.dart';
import '../models/app_models.dart';
import '../models/user_account_model.dart';
import '../services/supabase_sync_service.dart';

class AppState extends ChangeNotifier {
  FullAppBundle? _bundle;
  bool _isLoading = true;
  String? _error;

  // Persistent favorites & comparator
  final Set<String> _favoriteIds = {};
  final List<String> _compareIds = [];

  // Residences Filter State
  String _searchQuery = '';
  String _selectedCategory = 'Tous'; // Tous, Duplex, 1 Chambre, 2 Chambres, 3 Chambres
  num? _selectedFloor; // null = all floors, 0, 1, 2, 3, 4, 5
  String _selectedStatus = 'Tous'; // Tous, Disponible, Réservé, Vendu
  double _minSurface = 35;
  double _maxSurface = 240;
  bool _isGridView = true;
  bool _isFloorView = false;
  String _sortBy = 'num_asc'; // num_asc, surface_desc, surface_asc, floor_asc

  // Navigation tab index
  int _currentTabIndex = 0;

  // Client Portal & Admin Authentication State (Local + Optional Supabase Cloud)
  static const String _accountsStorageKey = 'jdb_accounts_v1';
  static const String _sessionUserIdKey = 'jdb_session_user_id_v1';
  static const String _visitsStorageKey = 'jdb_visits_v1';
  static const String _chantierStorageKey = 'jdb_chantier_v1';

  final SupabaseSyncService _cloud = SupabaseSyncService();
  final List<UserAccount> _accounts = [];
  final List<VisitBooking> _visits = [];
  ChantierProgress _chantierProgress = const ChantierProgress();
  String? _currentUserId;
  String? _lastAuthError;

  FullAppBundle? get bundle => _bundle;
  bool get isLoading => _isLoading;
  String? get error => _error;
  Set<String> get favoriteIds => _favoriteIds;
  List<String> get compareIds => _compareIds;
  String get searchQuery => _searchQuery;
  String get selectedCategory => _selectedCategory;
  num? get selectedFloor => _selectedFloor;
  String get selectedStatus => _selectedStatus;
  double get minSurface => _minSurface;
  double get maxSurface => _maxSurface;
  bool get isGridView => _isGridView;
  bool get isFloorView => _isFloorView;
  String get sortBy => _sortBy;
  int get currentTabIndex => _currentTabIndex;
  String? get lastAuthError => _lastAuthError;
  bool get isCloudConnected => _cloud.isConnected;
  String? get cloudUrl => _cloud.activeUrl;
  String? get cloudError => _cloud.lastError;

  UserAccount? get currentUser {
    if (_currentUserId == null) return null;
    for (final acc in _accounts) {
      if (acc.id == _currentUserId) return acc;
    }
    return null;
  }

  bool get isLoggedIn => currentUser != null;
  bool get isAdmin => currentUser?.isAdmin ?? false;

  List<UserAccount> get clientAccounts =>
      _accounts.where((a) => a.role == UserRole.client).toList();

  List<VisitBooking> get allVisits => List.unmodifiable(_visits);

  List<VisitBooking> get myVisits {
    final u = currentUser;
    if (u == null) return const [];
    return _visits.where((v) => v.userId == u.id).toList();
  }

  int get pendingVisitsCount =>
      _visits.where((v) => v.status == 'En attente').length;

  ChantierProgress get chantierProgress => _chantierProgress;

  double get adminTotalCollected => clientAccounts.fold(
        0.0,
        (sum, c) => sum + c.financialProfile.paidAmount,
      );

  double get adminTotalRemaining => clientAccounts.fold(
        0.0,
        (sum, c) => sum + c.financialProfile.remainingAmount,
      );

  ResidenceLot? findLotById(String? lotId) {
    if (lotId == null || lotId.trim().isEmpty) return null;
    for (final lot in allResidences) {
      if (lot.id.toLowerCase() == lotId.toLowerCase()) return lot;
    }
    return null;
  }

  List<ResidenceLot> get allResidences =>
      _bundle?.residences.where((r) => r.category != 'Magasin').toList() ?? [];

  List<ResidenceLot> get favoriteLots =>
      (_bundle?.residences ?? []).where((r) => _favoriteIds.contains(r.id)).toList();

  List<ResidenceLot> get comparedLots =>
      (_bundle?.residences ?? []).where((r) => _compareIds.contains(r.id)).toList();

  List<ResidenceLot> get filteredResidences {
    final source = allResidences;
    final filtered = source.where((lot) {
      // Search query
      if (_searchQuery.trim().isNotEmpty) {
        final q = _searchQuery.toLowerCase().trim();
        final matchId = lot.id.toLowerCase().contains(q) || lot.id.toLowerCase() == 'app $q';
        final matchTitle = lot.title.toLowerCase().contains(q);
        final matchFloor = lot.floorName.toLowerCase().contains(q);
        final matchView = lot.view.toLowerCase().contains(q);
        final matchComp = lot.roomsText.toLowerCase().contains(q);
        if (!matchId && !matchTitle && !matchFloor && !matchView && !matchComp) return false;
      }

      // Category filter
      if (_selectedCategory != 'Tous') {
        if (_selectedCategory == 'Duplex') {
          if (lot.category != 'Duplex') return false;
        } else if (_selectedCategory == '3 Chambres') {
          if (lot.category != '3 Chambres' && lot.bedrooms < 3) return false;
        } else if (_selectedCategory == '2 Chambres') {
          if (lot.category != '2 Chambres') return false;
        } else if (_selectedCategory == '1 Chambre') {
          if (lot.category != '1 Chambre') return false;
        }
      }

      // Floor filter
      if (_selectedFloor != null && lot.floor != _selectedFloor) {
        return false;
      }

      // Status filter
      if (_selectedStatus != 'Tous' && lot.status != _selectedStatus) {
        return false;
      }

      // Surface range
      if (lot.surface < _minSurface || lot.surface > _maxSurface) {
        return false;
      }

      return true;
    }).toList();

    int extractNum(ResidenceLot l) =>
        int.tryParse(l.id.replaceAll(RegExp(r'[^0-9]'), '')) ?? 0;

    switch (_sortBy) {
      case 'num_asc':
        filtered.sort((a, b) => extractNum(a).compareTo(extractNum(b)));
        break;
      case 'surface_desc':
        filtered.sort((a, b) {
          final cmp = b.surface.compareTo(a.surface);
          return cmp != 0 ? cmp : extractNum(a).compareTo(extractNum(b));
        });
        break;
      case 'surface_asc':
        filtered.sort((a, b) {
          final cmp = a.surface.compareTo(b.surface);
          return cmp != 0 ? cmp : extractNum(a).compareTo(extractNum(b));
        });
        break;
      case 'floor_asc':
        filtered.sort((a, b) {
          final cmp = a.floor.compareTo(b.floor);
          return cmp != 0 ? cmp : extractNum(a).compareTo(extractNum(b));
        });
        break;
      default:
        filtered.sort((a, b) => extractNum(a).compareTo(extractNum(b)));
    }

    return filtered;
  }

  Future<void> initialize() async {
    try {
      _isLoading = true;
      notifyListeners();

      final jsonString = await rootBundle.loadString(
        'assets/01_DATA_JSON_ET_API/full_app_bundle.json',
      );
      _bundle = FullAppBundle.fromRawJson(jsonString);

      final prefs = await SharedPreferences.getInstance();
      final savedFavs = prefs.getStringList('jdb_favorites') ?? [];
      final savedCompare = prefs.getStringList('jdb_compare') ?? [];

      _favoriteIds
        ..clear()
        ..addAll(savedFavs);
      _compareIds
        ..clear()
        ..addAll(savedCompare);

      await initializeAuthOnly();

      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Loads accounts and active session from SharedPreferences (seeds demos on first run).
  Future<void> initializeAuthOnly() async {
    final prefs = await SharedPreferences.getInstance();
    final rawAccounts = prefs.getString(_accountsStorageKey);
    if (rawAccounts != null && rawAccounts.isNotEmpty) {
      try {
        _accounts
          ..clear()
          ..addAll(UserAccount.decodeList(rawAccounts));
      } catch (_) {
        _seedDefaultAccounts();
        await _persistAccounts(prefs);
      }
    } else {
      _seedDefaultAccounts();
      await _persistAccounts(prefs);
    }

    final savedSessionId = prefs.getString(_sessionUserIdKey);
    if (savedSessionId != null &&
        _accounts.any((a) => a.id == savedSessionId)) {
      _currentUserId = savedSessionId;
    } else {
      _currentUserId = null;
    }

    // Load or seed VIP visit bookings
    final rawVisits = prefs.getString(_visitsStorageKey);
    if (rawVisits != null && rawVisits.isNotEmpty) {
      try {
        _visits
          ..clear()
          ..addAll(VisitBooking.decodeList(rawVisits));
      } catch (_) {
        _seedDefaultVisits();
        await _persistVisits(prefs);
      }
    } else {
      _seedDefaultVisits();
      await _persistVisits(prefs);
    }

    // Load chantier progress
    final rawChantier = prefs.getString(_chantierStorageKey);
    if (rawChantier != null && rawChantier.isNotEmpty) {
      try {
        _chantierProgress = ChantierProgress.decode(rawChantier);
      } catch (_) {
        _chantierProgress = const ChantierProgress();
      }
    }

    // Attempt silent Supabase auto-connect if URL & Anon Key are configured
    await _tryAutoConnectCloud();
    notifyListeners();
  }

  Future<void> _tryAutoConnectCloud() async {
    final connected = await _cloud.initialize();
    if (connected) {
      await syncFromCloud();
    }
  }

  Future<bool> connectSupabase(String url, String anonKey) async {
    final cfg = SupabaseConfig(url: url.trim(), anonKey: anonKey.trim());
    if (!cfg.isConfigured) return false;
    final ok = await _cloud.initialize(overrideConfig: cfg);
    if (!ok) {
      notifyListeners();
      return false;
    }
    await SupabaseConfig.save(cfg.url, cfg.anonKey);
    await syncFromCloud();
    notifyListeners();
    return true;
  }

  Future<void> disconnectSupabase() async {
    _cloud.disconnect();
    await SupabaseConfig.clear();
    notifyListeners();
  }

  Future<bool> syncFromCloud() async {
    if (!_cloud.isConnected) return false;
    final snap = await _cloud.pullAll();
    if (snap == null) return false;

    final prefs = await SharedPreferences.getInstance();
    if (snap.accounts.isEmpty) {
      for (final a in _accounts) {
        await _cloud.upsertAccount(a);
      }
    } else {
      _accounts
        ..clear()
        ..addAll(snap.accounts);
      await _persistAccounts(prefs);
    }

    if (snap.visits.isEmpty) {
      for (final v in _visits) {
        await _cloud.upsertVisit(v);
      }
    } else {
      _visits
        ..clear()
        ..addAll(snap.visits);
      await _persistVisits(prefs);
    }

    if (snap.chantier != null) {
      _chantierProgress = snap.chantier!;
      await prefs.setString(_chantierStorageKey, _chantierProgress.encode());
    } else {
      await _cloud.upsertChantier(_chantierProgress);
    }

    notifyListeners();
    return true;
  }

  void _seedDefaultVisits() {
    _visits
      ..clear()
      ..add(
        const VisitBooking(
          id: 'rdv-demo-01',
          userId: 'client-demo-02',
          clientName: 'Salma El Mansouri',
          clientPhone: '+212 6 68 22 90 44',
          date: '2026-11-28',
          timeSlot: '11h30',
          lotInterest: 'APP 2 — Duplex 3 Chambres',
          status: 'En attente',
          notes: 'Visite appartement témoin & découverte du rooftop',
        ),
      );
  }

  Future<void> _persistVisits([SharedPreferences? existingPrefs]) async {
    final prefs = existingPrefs ?? await SharedPreferences.getInstance();
    await prefs.setString(_visitsStorageKey, VisitBooking.encodeList(_visits));
  }

  Future<bool> bookVisit({
    required String date,
    required String timeSlot,
    String lotInterest = '',
    String notes = '',
  }) async {
    final u = currentUser;
    if (u == null || date.trim().isEmpty || timeSlot.trim().isEmpty) {
      return false;
    }
    final booking = VisitBooking(
      id: 'rdv-${DateTime.now().microsecondsSinceEpoch}',
      userId: u.id,
      clientName: u.name,
      clientPhone: u.phone,
      date: date.trim(),
      timeSlot: timeSlot.trim(),
      lotInterest: lotInterest.trim(),
      status: 'En attente',
      notes: notes.trim(),
    );
    _visits.insert(0, booking);
    await _persistVisits();
    await _cloud.upsertVisit(booking);
    notifyListeners();
    return true;
  }

  Future<bool> updateVisitStatus(String visitId, String newStatus) async {
    if (!isAdmin) return false;
    final idx = _visits.indexWhere((v) => v.id == visitId);
    if (idx == -1) return false;
    _visits[idx] = _visits[idx].copyWith(status: newStatus);
    await _persistVisits();
    await _cloud.upsertVisit(_visits[idx]);
    notifyListeners();
    return true;
  }

  Future<bool> updateChantierProgress({
    required int progressPercent,
    required String currentPhase,
  }) async {
    if (!isAdmin) return false;
    final now = DateTime.now();
    final updated = ChantierProgress(
      progressPercent: progressPercent.clamp(0, 100),
      currentPhase: currentPhase.trim(),
      lastUpdate:
          '${now.day.toString().padLeft(2, '0')}/${now.month.toString().padLeft(2, '0')}/${now.year}',
    );
    _chantierProgress = updated;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_chantierStorageKey, updated.encode());
    await _cloud.upsertChantier(updated);
    notifyListeners();
    return true;
  }

  void _seedDefaultAccounts() {
    _accounts
      ..clear()
      ..addAll([
        const UserAccount(
          id: 'admin-baytimmo-01',
          name: 'Direction BaytImmo Prestige',
          email: 'admin@bayt-immo.com',
          phone: '+212 6 65 64 43 91',
          password: 'admin123',
          role: UserRole.admin,
        ),
        const UserAccount(
          id: 'client-demo-01',
          name: 'Karim Benjelloun',
          email: 'karim@client.ma',
          phone: '+212 6 61 45 89 12',
          password: 'client123',
          role: UserRole.client,
          assignedLotId: 'APP 1',
          financialProfile: ClientFinancialProfile(
            totalPrice: 1850000,
            payments: [
              PaymentRecord(
                id: 'pay-demo-01',
                date: '2026-03-15',
                amount: 370000,
                trancheLabel: 'Tranche 1 : Réservation (20%)',
                method: 'Virement bancaire',
                status: 'Payé',
                receiptRef: 'REC-2026-001',
              ),
              PaymentRecord(
                id: 'pay-demo-02',
                date: '2026-07-10',
                amount: 370000,
                trancheLabel: 'Tranche 2 : Fondations & Sous-sol (20%)',
                method: 'Chèque certifié Notaire',
                status: 'Payé',
                receiptRef: 'REC-2026-002',
              ),
            ],
          ),
        ),
        const UserAccount(
          id: 'client-demo-02',
          name: 'Salma El Mansouri',
          email: 'salma@client.ma',
          phone: '+212 6 68 22 90 44',
          password: 'client123',
          role: UserRole.client,
        ),
      ]);
  }

  Future<void> _persistAccounts([SharedPreferences? existingPrefs]) async {
    final prefs = existingPrefs ?? await SharedPreferences.getInstance();
    await prefs.setString(_accountsStorageKey, UserAccount.encodeList(_accounts));
  }

  Future<bool> login(String email, String password) async {
    final normEmail = email.trim().toLowerCase();
    final pass = password.trim();
    _lastAuthError = null;

    for (final acc in _accounts) {
      if (acc.email.toLowerCase() == normEmail && acc.password == pass) {
        _currentUserId = acc.id;
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(_sessionUserIdKey, acc.id);
        notifyListeners();
        return true;
      }
    }
    _lastAuthError = 'Email ou mot de passe incorrect.';
    notifyListeners();
    return false;
  }

  Future<bool> register({
    required String name,
    required String email,
    required String phone,
    required String password,
  }) async {
    final normEmail = email.trim().toLowerCase();
    _lastAuthError = null;

    if (name.trim().isEmpty || normEmail.isEmpty || password.trim().isEmpty) {
      _lastAuthError = 'Veuillez remplir tous les champs obligatoires.';
      notifyListeners();
      return false;
    }

    if (_accounts.any((a) => a.email.toLowerCase() == normEmail)) {
      _lastAuthError = 'Un compte existe déjà avec cette adresse email.';
      notifyListeners();
      return false;
    }

    final newAcc = UserAccount(
      id: 'client-${DateTime.now().microsecondsSinceEpoch}',
      name: name.trim(),
      email: normEmail,
      phone: phone.trim(),
      password: password.trim(),
      role: UserRole.client,
    );
    _accounts.add(newAcc);
    _currentUserId = newAcc.id;

    final prefs = await SharedPreferences.getInstance();
    await _persistAccounts(prefs);
    await prefs.setString(_sessionUserIdKey, newAcc.id);
    await _cloud.upsertAccount(newAcc);
    notifyListeners();
    return true;
  }

  Future<bool> createClientAsAdmin({
    required String name,
    required String email,
    required String phone,
    required String password,
    String? assignedLotId,
    double totalPrice = 0,
  }) async {
    if (!isAdmin) return false;
    final normEmail = email.trim().toLowerCase();
    if (name.trim().isEmpty || normEmail.isEmpty) return false;
    if (_accounts.any((a) => a.email.toLowerCase() == normEmail)) return false;

    final newAcc = UserAccount(
      id: 'client-${DateTime.now().microsecondsSinceEpoch}',
      name: name.trim(),
      email: normEmail,
      phone: phone.trim(),
      password: password.trim().isEmpty ? 'client123' : password.trim(),
      role: UserRole.client,
      assignedLotId: assignedLotId,
      financialProfile: ClientFinancialProfile(totalPrice: totalPrice),
    );
    _accounts.add(newAcc);
    await _persistAccounts();
    await _cloud.upsertAccount(newAcc);
    notifyListeners();
    return true;
  }

  Future<void> logout() async {
    _currentUserId = null;
    _lastAuthError = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_sessionUserIdKey);
    notifyListeners();
  }

  Future<bool> assignLotToClient(
    String userId,
    String lotId,
    double totalPrice,
  ) async {
    if (!isAdmin) return false;
    final idx = _accounts.indexWhere((a) => a.id == userId && !a.isAdmin);
    if (idx == -1) return false;

    final existing = _accounts[idx];
    _accounts[idx] = existing.copyWith(
      assignedLotId: lotId.trim(),
      financialProfile: existing.financialProfile.copyWith(
        totalPrice: totalPrice < 0 ? 0 : totalPrice,
      ),
    );
    await _persistAccounts();
    await _cloud.upsertAccount(_accounts[idx]);
    notifyListeners();
    return true;
  }

  Future<bool> recordPayment(String userId, PaymentRecord payment) async {
    if (!isAdmin) return false;
    final idx = _accounts.indexWhere((a) => a.id == userId && !a.isAdmin);
    if (idx == -1) return false;

    final existing = _accounts[idx];
    final updatedPayments = [...existing.financialProfile.payments, payment];
    _accounts[idx] = existing.copyWith(
      financialProfile: existing.financialProfile.copyWith(
        payments: updatedPayments,
      ),
    );
    await _persistAccounts();
    await _cloud.upsertAccount(_accounts[idx]);
    notifyListeners();
    return true;
  }

  void setTabIndex(int index) {
    _currentTabIndex = index;
    notifyListeners();
  }

  String formatPrice(ResidenceLot lot) {
    return 'Prix sur demande';
  }

  String formatRetailPrice(RetailSpace space) {
    return 'Conditions sur demande';
  }

  bool isFavorite(String id) => _favoriteIds.contains(id);

  Future<void> toggleFavorite(String id) async {
    if (_favoriteIds.contains(id)) {
      _favoriteIds.remove(id);
    } else {
      _favoriteIds.add(id);
    }
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList('jdb_favorites', _favoriteIds.toList());
  }

  bool isCompared(String id) => _compareIds.contains(id);

  Future<String?> toggleCompare(String id) async {
    if (_compareIds.contains(id)) {
      _compareIds.remove(id);
      notifyListeners();
      final prefs = await SharedPreferences.getInstance();
      await prefs.setStringList('jdb_compare', _compareIds);
      return null;
    } else {
      if (_compareIds.length >= 3) {
        return 'Vous pouvez comparer jusqu\'à 3 lots simultanément.';
      }
      _compareIds.add(id);
      notifyListeners();
      final prefs = await SharedPreferences.getInstance();
      await prefs.setStringList('jdb_compare', _compareIds);
      return null;
    }
  }

  Future<void> clearCompare() async {
    _compareIds.clear();
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList('jdb_compare', _compareIds);
  }

  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }

  void setCategory(String category) {
    _selectedCategory = category;
    notifyListeners();
  }

  void setSelectedCategory(String category) => setCategory(category);

  void setFloor(num? floor) {
    _selectedFloor = floor;
    notifyListeners();
  }

  void setSelectedFloor(num? floor) => setFloor(floor);

  void setStatus(String status) {
    _selectedStatus = status;
    notifyListeners();
  }

  void setSelectedStatus(String status) => setStatus(status);

  void setSurfaceRange(double min, double max) {
    _minSurface = min;
    _maxSurface = max;
    notifyListeners();
  }

  void toggleViewMode() {
    _isGridView = !_isGridView;
    notifyListeners();
  }

  void setFloorView(bool enabled) {
    _isFloorView = enabled;
    notifyListeners();
  }

  void setSortBy(String sort) {
    _sortBy = sort;
    notifyListeners();
  }

  void resetFilters() {
    _searchQuery = '';
    _selectedCategory = 'Tous';
    _selectedFloor = null;
    _selectedStatus = 'Tous';
    _minSurface = 35;
    _maxSurface = 240;
    _sortBy = 'num_asc';
    notifyListeners();
  }

  /// Built-in AI Concierge answer engine grounded on architectural project data
  String askConcierge(String userQuestion) {
    final q = userQuestion.toLowerCase();
    final b = _bundle;
    if (b == null) return 'Chargement des données en cours...';

    if (q.contains('étranger') || q.contains('vna') || q.contains('non-résident') || q.contains('titre foncier')) {
      return 'Oui, à 100% ! Le projet Jardins de Bali est situé en périmètre urbain sur le Titre Foncier ${b.project.titreFoncier} à Marrakech Menara. L\'autorisation VNA (Vocation Non Agricole) n\'est donc PAS requise pour les lots résidentiels et commerciaux. Les acquéreurs étrangers bénéficient d\'un titre foncier individuel définitif et de la garantie de rapatriement des fonds.';
    }

    if (q.contains('vefa') || q.contains('paiement') || q.contains('échéancier') || q.contains('tranche')) {
      return 'L\'acquisition est régie par la loi marocaine VEFA (Loi 107-12) avec garantie financière d\'achèvement bancaire (GFA) en 5 tranches réglementaires :\n• 10% à la réservation\n• 20% à l\'achèvement des fondations\n• 30% au gros œuvre\n• 30% aux finitions intérieures\n• 10% à la remise des clés et signature de l\'acte notarié.';
    }

    if (q.contains('rendement') || q.contains('locatif') || q.contains('airbnb') || q.contains('rentabilité')) {
      return 'Grâce à son emplacement stratégique (5 minutes de l\'aéroport Menara RAK et 3 min des Jardins de la Ménara) et ses prestations de prestige (double piscine rooftop de 78 mètres, patio bioclimatique), le potentiel locatif saisonnier de haut standing est remarquable. Pour recevoir une étude personnalisée, contactez directement nos conseillers via WhatsApp.';
    }

    if (q.contains('prix') || q.contains('combien') || q.contains('tarif') || q.contains('budget')) {
      return 'Les prix des lots sont communiqués sur demande personnalisée auprès de nos conseillers BaytImmo. Indiquez la typologie qui vous intéresse (Studio, 1 à 3 Chambres, Penthouse ou Commerce) ou cliquez sur le bouton WhatsApp pour recevoir la grille tarifaire officielle à jour.';
    }

    if (q.contains('studio') || q.contains('petit')) {
      final count = allResidences.where((r) => r.category == 'Studio' && r.isAvailable).length;
      return 'Nous proposons $count Studios contemporains de 38 m² à 45 m² avec agencement optimisé, cuisine américaine et balcon. Contactez-nous sur WhatsApp pour connaître les lots disponibles et recevoir la brochure.';
    }

    if (q.contains('penthouse') || q.contains('terrasse') || q.contains('rooftop') || q.contains('5')) {
      return 'Les 38 Penthouses et appartements d\'exception sont situés au 5ème étage (R+5) avec de vastes terrasses panoramiques en gradins privatives (surfaces jusqu\'à 116 m² habitables + terrasses) offrant une vue imprenable sur l\'Atlas et les jardins intérieurs.';
    }

    if (q.contains('magasin') || q.contains('commerce') || q.contains('bureau') || q.contains('retail')) {
      return 'Côté commercial au Quartier Rahham (Lot B5, Menara) : 4 Grands Magasins Flagships totalisant 554 m² (2 boutiques de 56 m² et 2 grands flagships de 221 m², hauteur sous plafond 5.20 m, gaine d\'extraction IT 246) avec prolongements en mezzanine privative et parkings dédiés.';
    }

    if (q.contains('piscine') || q.contains('prestation') || q.contains('parking')) {
      return 'Les résidents bénéficient de prestations signature exceptionnelles : Double piscine panoramique suspendue de 78m en toiture-terrasse, patio intérieur arboré de 38 palmiers Phoenix avec fontaine monumentale et cascades, solarium, conciergerie 24/7 et 2 sous-sols complets de parking sécurisé (plus de 234 places).';
    }

    return 'Je suis votre Concierge Privé officiel des Jardins de Bali Menara (${b.project.titreFoncier}). Posez-moi vos questions sur le programme architectural (230 résidences, 4 commerces), les terrasses en gradins, l\'acquisition en VEFA ou contactez un conseiller sur WhatsApp pour réserver un lot !';
  }
}
