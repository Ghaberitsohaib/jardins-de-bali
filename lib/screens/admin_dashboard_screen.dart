// =========================================================================
// JARDINS DE BALI — DASHBOARD ADMIN PROMOTEUR BAYTIMMO
// Gestion des Acquéreurs, Attribution des 230 Lots & Suivi des Versements
// =========================================================================

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/user_account_model.dart';
import '../state/app_state.dart';
import '../theme/imperial_theme.dart';

class AdminDashboardScreen extends StatefulWidget {
  final AppState appState;

  const AdminDashboardScreen({super.key, required this.appState});

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  String _search = '';
  int _activeTab = 0; // 0 = Acquéreurs, 1 = Rendez-vous, 2 = Chantier
  double? _draftChantierPct;
  String? _draftChantierPhase;

  void _openCreateClientDialog() {
    final nameCtrl = TextEditingController();
    final emailCtrl = TextEditingController();
    final phoneCtrl = TextEditingController();
    final passCtrl = TextEditingController(text: 'client123');

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(bottom: MediaQuery.of(ctx).viewInsets.bottom),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(26)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Nouvel Acquéreur VIP',
                style: GoogleFonts.playfairDisplay(
                  fontSize: 19,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 14),
              TextField(
                controller: nameCtrl,
                decoration: _fieldDeco('Nom complet *'),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: emailCtrl,
                keyboardType: TextInputType.emailAddress,
                decoration: _fieldDeco('Email *'),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: phoneCtrl,
                keyboardType: TextInputType.phone,
                decoration: _fieldDeco('Téléphone / WhatsApp'),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: passCtrl,
                decoration: _fieldDeco('Mot de passe initial'),
              ),
              const SizedBox(height: 18),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF111710),
                    foregroundColor: const Color(0xFFDFBA73),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  onPressed: () async {
                    final ok = await widget.appState.createClientAsAdmin(
                      name: nameCtrl.text,
                      email: emailCtrl.text,
                      phone: phoneCtrl.text,
                      password: passCtrl.text,
                    );
                    if (ctx.mounted) Navigator.of(ctx).pop();
                    if (!mounted) return;
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        backgroundColor: const Color(0xFF131A12),
                        content: Text(
                          ok
                              ? 'Acquéreur créé avec succès.'
                              : 'Impossible de créer le compte (email déjà utilisé ou invalide).',
                          style: const TextStyle(color: Color(0xFFDFBA73)),
                        ),
                      ),
                    );
                  },
                  child: Text(
                    'CRÉER LE DOSSIER ACQUÉREUR',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 12,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 1.0,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _openAssignLotSheet(UserAccount client) {
    final priceCtrl = TextEditingController(
      text: client.financialProfile.totalPrice > 0
          ? client.financialProfile.totalPrice.round().toString()
          : '1850000',
    );
    String lotFilter = '';
    String selectedLotId = client.assignedLotId ??
        (widget.appState.allResidences.isNotEmpty
            ? widget.appState.allResidences.first.id
            : 'APP 1');

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setSheetState) {
          final matchingLots = widget.appState.allResidences.where((l) {
            if (lotFilter.trim().isEmpty) return true;
            final q = lotFilter.toLowerCase().trim();
            return l.id.toLowerCase().contains(q) ||
                l.title.toLowerCase().contains(q) ||
                l.floorName.toLowerCase().contains(q);
          }).take(40).toList();

          return Padding(
            padding: EdgeInsets.only(bottom: MediaQuery.of(ctx).viewInsets.bottom),
            child: Container(
              height: MediaQuery.of(ctx).size.height * 0.78,
              padding: const EdgeInsets.all(20),
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(26)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Assigner un Lot à ${client.name}',
                    style: GoogleFonts.playfairDisplay(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: priceCtrl,
                    keyboardType: TextInputType.number,
                    decoration: _fieldDeco('Prix Total Convenu (DH)'),
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    onChanged: (v) => setSheetState(() => lotFilter = v),
                    decoration: _fieldDeco('Rechercher un lot (ex: APP 12, Duplex...)'),
                  ),
                  const SizedBox(height: 10),
                  Expanded(
                    child: ListView.builder(
                      itemCount: matchingLots.length,
                      itemBuilder: (_, idx) {
                        final lot = matchingLots[idx];
                        final isSel = selectedLotId == lot.id;
                        return ListTile(
                          dense: true,
                          selected: isSel,
                          selectedTileColor:
                              const Color(0xFFC5A880).withValues(alpha: 0.16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          title: Text(
                            lot.title,
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 12.5,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          subtitle: Text(
                            '${lot.floorName} • ${lot.surfaceFormatted}',
                            style: GoogleFonts.plusJakartaSans(fontSize: 11),
                          ),
                          trailing: isSel
                              ? const Icon(Icons.check_circle_rounded,
                                  color: Color(0xFF8C6D42))
                              : null,
                          onTap: () => setSheetState(() => selectedLotId = lot.id),
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF111710),
                        foregroundColor: const Color(0xFFDFBA73),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                      ),
                      onPressed: () async {
                        final parsedPrice =
                            double.tryParse(priceCtrl.text.replaceAll(' ', '')) ?? 0;
                        await widget.appState.assignLotToClient(
                          client.id,
                          selectedLotId,
                          parsedPrice,
                        );
                        if (ctx.mounted) Navigator.of(ctx).pop();
                        if (!mounted) return;
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            backgroundColor: const Color(0xFF131A12),
                            content: Text(
                              '$selectedLotId assigné à ${client.name} (${formatMadAmount(parsedPrice)}).',
                              style: const TextStyle(color: Color(0xFFDFBA73)),
                            ),
                          ),
                        );
                      },
                      child: Text(
                        'CONFIRMER L\'ATTRIBUTION ($selectedLotId)',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 12,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.8,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  void _openRecordPaymentSheet(UserAccount client) {
    final amountCtrl = TextEditingController();
    final now = DateTime.now();
    final dateCtrl = TextEditingController(
      text:
          '${now.year}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}',
    );
    String tranche = 'Tranche 1 : Réservation (20%)';
    String method = 'Virement bancaire';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setSheetState) => Padding(
          padding: EdgeInsets.only(bottom: MediaQuery.of(ctx).viewInsets.bottom),
          child: Container(
            padding: const EdgeInsets.all(20),
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(top: Radius.circular(26)),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Enregistrer un Versement',
                  style: GoogleFonts.playfairDisplay(
                    fontSize: 19,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                Text(
                  'Client : ${client.name} (${client.assignedLotId ?? "Non assigné"})',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 11.5,
                    color: const Color(0xFF6B7368),
                  ),
                ),
                const SizedBox(height: 14),
                TextField(
                  controller: amountCtrl,
                  keyboardType: TextInputType.number,
                  decoration: _fieldDeco('Montant encaissé (DH) *'),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: dateCtrl,
                  decoration: _fieldDeco('Date (AAAA-MM-JJ)'),
                ),
                const SizedBox(height: 10),
                DropdownButtonFormField<String>(
                  initialValue: tranche,
                  decoration: _fieldDeco('Tranche VEFA'),
                  items: const [
                    'Tranche 1 : Réservation (20%)',
                    'Tranche 2 : Fondations & Sous-sol (20%)',
                    'Tranche 3 : Gros Œuvre & Toiture (30%)',
                    'Tranche 4 : Finitions & Remise des Clés (30%)',
                  ]
                      .map((t) => DropdownMenuItem(value: t, child: Text(t)))
                      .toList(),
                  onChanged: (v) =>
                      setSheetState(() => tranche = v ?? tranche),
                ),
                const SizedBox(height: 10),
                DropdownButtonFormField<String>(
                  initialValue: method,
                  decoration: _fieldDeco('Mode de règlement'),
                  items: const [
                    'Virement bancaire',
                    'Chèque certifié Notaire',
                    'Versement agence',
                  ]
                      .map((m) => DropdownMenuItem(value: m, child: Text(m)))
                      .toList(),
                  onChanged: (v) => setSheetState(() => method = v ?? method),
                ),
                const SizedBox(height: 18),
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF111710),
                      foregroundColor: const Color(0xFFDFBA73),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    onPressed: () async {
                      final amt = double.tryParse(
                              amountCtrl.text.replaceAll(' ', '')) ??
                          0;
                      if (amt <= 0) return;
                      final seq = client.financialProfile.payments.length + 1;
                      final payment = PaymentRecord(
                        id: 'pay-${DateTime.now().microsecondsSinceEpoch}',
                        date: dateCtrl.text.trim(),
                        amount: amt,
                        trancheLabel: tranche,
                        method: method,
                        status: 'Payé',
                        receiptRef:
                            'REC-${now.year}-${seq.toString().padLeft(3, '0')}',
                      );
                      await widget.appState.recordPayment(client.id, payment);
                      if (ctx.mounted) Navigator.of(ctx).pop();
                      if (!mounted) return;
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          backgroundColor: const Color(0xFF131A12),
                          content: Text(
                            'Versement de ${formatMadAmount(amt)} enregistré pour ${client.name}.',
                            style: const TextStyle(color: Color(0xFFDFBA73)),
                          ),
                        ),
                      );
                    },
                    child: Text(
                      'VALIDER LE VERSEMENT',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 1.0,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Future<void> _openCloudConfigSheet(BuildContext context) async {
    final urlCtrl =
        TextEditingController(text: widget.appState.cloudUrl ?? '');
    final keyCtrl = TextEditingController();
    bool busy = false;
    String? feedback;

    await showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setSheetState) => Container(
          padding: EdgeInsets.fromLTRB(
            20,
            20,
            20,
            MediaQuery.of(ctx).viewInsets.bottom + 24,
          ),
          decoration: const BoxDecoration(
            color: Color(0xFFFCFBF7),
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          ),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(9),
                      decoration: BoxDecoration(
                        color: const Color(0xFF131A12),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(
                        widget.appState.isCloudConnected
                            ? Icons.cloud_done_rounded
                            : Icons.cloud_sync_rounded,
                        size: 18,
                        color: widget.appState.isCloudConnected
                            ? const Color(0xFF8CE29E)
                            : const Color(0xFFDFBA73),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Synchronisation Cloud Supabase',
                            style: GoogleFonts.playfairDisplay(
                              fontSize: 18,
                              fontWeight: FontWeight.w700,
                              color: const Color(0xFF111710),
                            ),
                          ),
                          Text(
                            widget.appState.isCloudConnected
                                ? 'Connecté en temps réel (PostgreSQL)'
                                : 'Mode local actif — Collez vos clés Supabase',
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 11,
                              color: widget.appState.isCloudConnected
                                  ? const Color(0xFF2E7D32)
                                  : const Color(0xFF6B7368),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                TextField(
                  controller: urlCtrl,
                  decoration: InputDecoration(
                    labelText: 'Supabase Project URL',
                    hintText: 'https://xxxx.supabase.co',
                    filled: true,
                    fillColor: Colors.white,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: keyCtrl,
                  obscureText: true,
                  decoration: InputDecoration(
                    labelText: 'Supabase Anon Key',
                    hintText: 'eyJhbGciOiJIUzI1NiIs...',
                    filled: true,
                    fillColor: Colors.white,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                ),
                if (feedback != null) ...[
                  const SizedBox(height: 8),
                  Text(
                    feedback!,
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 11.5,
                      fontWeight: FontWeight.w600,
                      color: const Color(0xFFB71C1C),
                    ),
                  ),
                ],
                const SizedBox(height: 14),
                Row(
                  children: [
                    if (widget.appState.isCloudConnected) ...[
                      Expanded(
                        child: OutlinedButton(
                          onPressed: busy
                              ? null
                              : () async {
                                  await widget.appState.disconnectSupabase();
                                  if (ctx.mounted) Navigator.of(ctx).pop();
                                },
                          style: OutlinedButton.styleFrom(
                            foregroundColor: const Color(0xFFB71C1C),
                            side: const BorderSide(color: Color(0xFFB71C1C)),
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14),
                            ),
                          ),
                          child: const Text('Déconnecter'),
                        ),
                      ),
                      const SizedBox(width: 10),
                    ],
                    Expanded(
                      flex: 2,
                      child: ElevatedButton(
                        onPressed: busy
                            ? null
                            : () async {
                                setSheetState(() {
                                  busy = true;
                                  feedback = null;
                                });
                                final ok = await widget.appState
                                    .connectSupabase(urlCtrl.text, keyCtrl.text);
                                if (ok) {
                                  if (ctx.mounted) Navigator.of(ctx).pop();
                                  if (!mounted) return;
                                  ScaffoldMessenger.of(this.context)
                                      .showSnackBar(
                                    const SnackBar(
                                      backgroundColor: Color(0xFF131A12),
                                      content: Text(
                                        'Supabase Cloud connecté et synchronisé !',
                                        style:
                                            TextStyle(color: Color(0xFF8CE29E)),
                                      ),
                                    ),
                                  );
                                } else {
                                  setSheetState(() {
                                    busy = false;
                                    feedback = widget.appState.cloudError ??
                                        'Vérifiez l\'URL, la clé Anon et que supabase/schema.sql a été exécuté.';
                                  });
                                }
                              },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF111710),
                          foregroundColor: const Color(0xFFDFBA73),
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14),
                          ),
                        ),
                        child: Text(
                          busy
                              ? 'CONNEXION...'
                              : 'CONNECTER & SYNCHRONISER',
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 12,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: widget.appState,
      builder: (context, _) {
        if (!widget.appState.isAdmin) {
          return Scaffold(
            backgroundColor: ImperialColors.background,
            appBar: AppBar(title: const Text('Accès Restreint')),
            body: const Center(
              child: Text('Accès réservé aux administrateurs BaytImmo.'),
            ),
          );
        }

        final clients = widget.appState.clientAccounts.where((c) {
          if (_search.trim().isEmpty) return true;
          final q = _search.toLowerCase().trim();
          return c.name.toLowerCase().contains(q) ||
              c.email.toLowerCase().contains(q) ||
              (c.assignedLotId?.toLowerCase().contains(q) ?? false);
        }).toList();

        return Scaffold(
          backgroundColor: ImperialColors.background,
          body: Column(
            children: [
              // Admin Luxury Header + KPIs
              Container(
                width: double.infinity,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [Color(0xFF0A0E09), Color(0xFF141C13)],
                  ),
                  border: Border(
                    bottom: BorderSide(
                      color: const Color(0xFFC5A880).withValues(alpha: 0.25),
                    ),
                  ),
                ),
                padding: const EdgeInsets.fromLTRB(16, 12, 16, 18),
                child: SafeArea(
                  bottom: false,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          GestureDetector(
                            onTap: () => Navigator.of(context).pop(),
                            child: Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: Colors.white.withValues(alpha: 0.08),
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(
                                Icons.arrow_back_ios_new_rounded,
                                size: 15,
                                color: Colors.white,
                              ),
                            ),
                          ),
                          Text(
                            'DASHBOARD PROMOTEUR BAYTIMMO',
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 9.5,
                              fontWeight: FontWeight.w700,
                              letterSpacing: 1.8,
                              color: const Color(0xFFDFBA73),
                            ),
                          ),
                          Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              GestureDetector(
                                onTap: () => _openCloudConfigSheet(context),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 9, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: widget.appState.isCloudConnected
                                        ? const Color(0xFF2E7D32)
                                            .withValues(alpha: 0.25)
                                        : Colors.white.withValues(alpha: 0.08),
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(
                                      color: widget.appState.isCloudConnected
                                          ? const Color(0xFF8CE29E)
                                          : const Color(0xFFC5A880)
                                              .withValues(alpha: 0.35),
                                    ),
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Icon(
                                        widget.appState.isCloudConnected
                                            ? Icons.cloud_done_rounded
                                            : Icons.cloud_outlined,
                                        size: 14,
                                        color: widget.appState.isCloudConnected
                                            ? const Color(0xFF8CE29E)
                                            : const Color(0xFFDFBA73),
                                      ),
                                      const SizedBox(width: 4),
                                      Text(
                                        widget.appState.isCloudConnected
                                            ? 'Cloud'
                                            : 'Supabase',
                                        style: GoogleFonts.plusJakartaSans(
                                          fontSize: 9.5,
                                          fontWeight: FontWeight.w700,
                                          color: Colors.white,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                              const SizedBox(width: 6),
                              GestureDetector(
                                onTap: () async {
                                  await widget.appState.logout();
                                  if (context.mounted) {
                                    Navigator.of(context).pop();
                                  }
                                },
                                child: Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 10, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: Colors.white.withValues(alpha: 0.08),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: const Icon(Icons.logout_rounded,
                                      size: 15, color: Color(0xFFDFBA73)),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),
                      // 3 KPI Cards Row
                      Row(
                        children: [
                          Expanded(
                            child: _kpiTile(
                              'ACQUÉREURS',
                              '${widget.appState.clientAccounts.length}',
                              Colors.white,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: _kpiTile(
                              'ENCAISSÉ',
                              formatMadAmount(
                                  widget.appState.adminTotalCollected),
                              const Color(0xFF8CE29E),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: _kpiTile(
                              'ENCOURS',
                              formatMadAmount(
                                  widget.appState.adminTotalRemaining),
                              const Color(0xFFEFD39B),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      // 3-Tab Admin Mode Switcher
                      Row(
                        children: [
                          _adminTab(0, Icons.people_alt_rounded, 'Acquéreurs'),
                          const SizedBox(width: 6),
                          _adminTab(
                            1,
                            Icons.calendar_month_rounded,
                            'RDV (${widget.appState.pendingVisitsCount})',
                          ),
                          const SizedBox(width: 6),
                          _adminTab(2, Icons.engineering_rounded, 'Chantier'),
                        ],
                      ),
                      if (_activeTab == 0) ...[
                        const SizedBox(height: 12),
                        // Search & New Client Row
                        Row(
                          children: [
                            Expanded(
                              child: Container(
                                height: 42,
                                decoration: BoxDecoration(
                                  color: Colors.white.withValues(alpha: 0.08),
                                  borderRadius: BorderRadius.circular(14),
                                ),
                                child: TextField(
                                  onChanged: (v) => setState(() => _search = v),
                                  style: const TextStyle(
                                      color: Colors.white, fontSize: 12.5),
                                  decoration: const InputDecoration(
                                    hintText: 'Rechercher un client ou lot...',
                                    hintStyle: TextStyle(
                                        color: Colors.white54, fontSize: 12),
                                    prefixIcon: Icon(Icons.search_rounded,
                                        size: 18, color: Color(0xFFDFBA73)),
                                    border: InputBorder.none,
                                    contentPadding:
                                        EdgeInsets.symmetric(vertical: 10),
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            SizedBox(
                              height: 42,
                              child: ElevatedButton.icon(
                                onPressed: _openCreateClientDialog,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFFDFBA73),
                                  foregroundColor: const Color(0xFF0E140D),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(14),
                                  ),
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 12),
                                ),
                                icon: const Icon(Icons.person_add_alt_1_rounded,
                                    size: 16),
                                label: Text(
                                  'Ajouter',
                                  style: GoogleFonts.plusJakartaSans(
                                    fontSize: 11.5,
                                    fontWeight: FontWeight.w800,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ],
                  ),
                ),
              ),

              // Body Content based on active Admin tab
              Expanded(
                child: _activeTab == 0
                    ? _buildClientsList(clients)
                    : (_activeTab == 1
                        ? _buildVisitsAdminTab()
                        : _buildChantierAdminTab()),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _adminTab(int index, IconData icon, String label) {
    final active = _activeTab == index;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _activeTab = index),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 220),
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            gradient: active
                ? const LinearGradient(
                    colors: [Color(0xFFE8CC95), Color(0xFFC5A880)],
                  )
                : null,
            color: active ? null : Colors.white.withValues(alpha: 0.06),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: active
                  ? const Color(0xFFFFE8B8).withValues(alpha: 0.7)
                  : Colors.white.withValues(alpha: 0.1),
            ),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: 14,
                color: active ? const Color(0xFF0E140D) : const Color(0xFFDFBA73),
              ),
              const SizedBox(width: 5),
              Text(
                label,
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 11,
                  fontWeight: active ? FontWeight.w800 : FontWeight.w600,
                  color: active ? const Color(0xFF0E140D) : Colors.white70,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildClientsList(List<UserAccount> clients) {
    return ListView.builder(
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 40),
                  itemCount: clients.length,
                  itemBuilder: (_, idx) {
                    final c = clients[idx];
                    final fp = c.financialProfile;
                    final pct = (fp.progressPercent * 100).round();

                    return Container(
                      margin: const EdgeInsets.only(bottom: 14),
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(22),
                        border: Border.all(color: const Color(0xFFEAE5DA)),
                        boxShadow: ImperialTheme.modernCardShadow,
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              CircleAvatar(
                                radius: 20,
                                backgroundColor: const Color(0xFF131A12),
                                child: Text(
                                  c.name.isNotEmpty
                                      ? c.name[0].toUpperCase()
                                      : 'C',
                                  style: GoogleFonts.playfairDisplay(
                                    color: const Color(0xFFDFBA73),
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      c.name,
                                      style: GoogleFonts.playfairDisplay(
                                        fontSize: 15.5,
                                        fontWeight: FontWeight.w700,
                                        color: const Color(0xFF111710),
                                      ),
                                    ),
                                    Text(
                                      '${c.email} • ${c.phone}',
                                      style: GoogleFonts.plusJakartaSans(
                                        fontSize: 11,
                                        color: const Color(0xFF6B7368),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 9, vertical: 4),
                                decoration: BoxDecoration(
                                  color: c.hasAssignedLot
                                      ? const Color(0xFF131A12)
                                      : const Color(0xFFF3EFE6),
                                  borderRadius: BorderRadius.circular(99),
                                ),
                                child: Text(
                                  c.hasAssignedLot
                                      ? c.assignedLotId!
                                      : 'Non assigné',
                                  style: GoogleFonts.plusJakartaSans(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w800,
                                    color: c.hasAssignedLot
                                        ? const Color(0xFFDFBA73)
                                        : const Color(0xFF8C6D42),
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          if (c.hasAssignedLot) ...[
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Payé : ${formatMadAmount(fp.paidAmount)} / ${formatMadAmount(fp.totalPrice)}',
                                  style: GoogleFonts.plusJakartaSans(
                                    fontSize: 11.5,
                                    fontWeight: FontWeight.w700,
                                    color: const Color(0xFF1E261D),
                                  ),
                                ),
                                Text(
                                  '$pct%',
                                  style: GoogleFonts.plusJakartaSans(
                                    fontSize: 11.5,
                                    fontWeight: FontWeight.w800,
                                    color: const Color(0xFF8C6D42),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 6),
                            ClipRRect(
                              borderRadius: BorderRadius.circular(99),
                              child: LinearProgressIndicator(
                                value: fp.progressPercent,
                                minHeight: 6,
                                backgroundColor: const Color(0xFFEEE9DF),
                                valueColor: const AlwaysStoppedAnimation<Color>(
                                    Color(0xFFC5A880)),
                              ),
                            ),
                            const SizedBox(height: 12),
                          ],
                          Row(
                            children: [
                              Expanded(
                                child: OutlinedButton.icon(
                                  onPressed: () => _openAssignLotSheet(c),
                                  style: OutlinedButton.styleFrom(
                                    foregroundColor: const Color(0xFF141A13),
                                    side: const BorderSide(
                                        color: Color(0xFFC5A880)),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                  ),
                                  icon: const Icon(Icons.apartment_rounded,
                                      size: 15, color: Color(0xFF8C6D42)),
                                  label: Text(
                                    c.hasAssignedLot
                                        ? 'Modifier Lot'
                                        : 'Assigner Lot',
                                    style: GoogleFonts.plusJakartaSans(
                                      fontSize: 11,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: ElevatedButton.icon(
                                  onPressed: c.hasAssignedLot
                                      ? () => _openRecordPaymentSheet(c)
                                      : null,
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFF111710),
                                    foregroundColor: const Color(0xFFDFBA73),
                                    disabledBackgroundColor:
                                        const Color(0xFFEAE5DA),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                  ),
                                  icon: const Icon(Icons.add_card_rounded,
                                      size: 15),
                                  label: Text(
                                    'Versement',
                                    style: GoogleFonts.plusJakartaSans(
                                      fontSize: 11,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    );
                  },
                );
  }

  Widget _buildVisitsAdminTab() {
    final visits = widget.appState.allVisits;
    if (visits.isEmpty) {
      return const Center(child: Text('Aucun rendez-vous programmé.'));
    }
    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 40),
      itemCount: visits.length,
      itemBuilder: (_, idx) {
        final v = visits[idx];
        final isConfirmed = v.status == 'Confirmé';
        final isDone = v.status == 'Terminé';
        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFFEAE5DA)),
            boxShadow: ImperialTheme.modernCardShadow,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    v.clientName,
                    style: GoogleFonts.playfairDisplay(
                      fontSize: 15.5,
                      fontWeight: FontWeight.w700,
                      color: const Color(0xFF111710),
                    ),
                  ),
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
                    decoration: BoxDecoration(
                      color: isConfirmed
                          ? const Color(0xFFE8F5E9)
                          : (isDone
                              ? const Color(0xFFECEFF1)
                              : const Color(0xFFFFF3E0)),
                      borderRadius: BorderRadius.circular(99),
                    ),
                    child: Text(
                      v.status,
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 10,
                        fontWeight: FontWeight.w800,
                        color: isConfirmed
                            ? const Color(0xFF2E7D32)
                            : (isDone
                                ? const Color(0xFF546E7A)
                                : const Color(0xFFED6C02)),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 4),
              Text(
                '${v.date} à ${v.timeSlot} • ${v.clientPhone}',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 11.5,
                  fontWeight: FontWeight.w600,
                  color: const Color(0xFF8C6D42),
                ),
              ),
              if (v.lotInterest.isNotEmpty) ...[
                const SizedBox(height: 4),
                Text(
                  v.lotInterest,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 11.5,
                    color: const Color(0xFF555E53),
                  ),
                ),
              ],
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: isConfirmed
                          ? null
                          : () => widget.appState
                              .updateVisitStatus(v.id, 'Confirmé'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF131A12),
                        foregroundColor: const Color(0xFFDFBA73),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      icon: const Icon(Icons.check_rounded, size: 15),
                      label: Text(
                        'Confirmer',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: isDone
                          ? null
                          : () => widget.appState
                              .updateVisitStatus(v.id, 'Terminé'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: const Color(0xFF141A13),
                        side: const BorderSide(color: Color(0xFFC5A880)),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      icon: const Icon(Icons.done_all_rounded, size: 15),
                      label: Text(
                        'Terminé',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildChantierAdminTab() {
    final current = widget.appState.chantierProgress;
    final pct = _draftChantierPct ?? current.progressPercent.toDouble();
    final phase = _draftChantierPhase ?? current.currentPhase;

    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 40),
      children: [
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: const Color(0xFFEAE5DA)),
            boxShadow: ImperialTheme.modernCardShadow,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Mise à Jour du Chantier',
                style: GoogleFonts.playfairDisplay(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: const Color(0xFF111710),
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Toute modification s\'affiche immédiatement dans l\'Espace Propriétaire de tous vos acquéreurs.',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 11.5,
                  color: const Color(0xFF6B7368),
                ),
              ),
              const SizedBox(height: 18),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Avancement Global',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  Text(
                    '${pct.round()}%',
                    style: GoogleFonts.playfairDisplay(
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                      color: const Color(0xFF8C6D42),
                    ),
                  ),
                ],
              ),
              Slider(
                min: 0,
                max: 100,
                divisions: 20,
                activeColor: const Color(0xFFC5A880),
                value: pct,
                onChanged: (v) => setState(() => _draftChantierPct = v),
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                initialValue: ChantierProgress.officialPhases.contains(phase)
                    ? phase
                    : ChantierProgress.officialPhases.first,
                decoration: _fieldDeco('Phase Active du Projet'),
                items: ChantierProgress.officialPhases
                    .map((p) => DropdownMenuItem(value: p, child: Text(p)))
                    .toList(),
                onChanged: (v) => setState(() => _draftChantierPhase = v),
              ),
              const SizedBox(height: 18),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton.icon(
                  onPressed: () async {
                    await widget.appState.updateChantierProgress(
                      progressPercent: pct.round(),
                      currentPhase: phase,
                    );
                    if (!mounted) return;
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        backgroundColor: const Color(0xFF131A12),
                        content: Text(
                          'Avancement chantier publié : ${pct.round()}% ($phase).',
                          style: const TextStyle(color: Color(0xFFDFBA73)),
                        ),
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF131A12),
                    foregroundColor: const Color(0xFFDFBA73),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                  icon: const Icon(Icons.publish_rounded, size: 17),
                  label: Text(
                    'PUBLIER LA MISE À JOUR',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 12,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 0.9,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _kpiTile(String label, String value, Color valueColor) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.06),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 8.5,
              fontWeight: FontWeight.w700,
              letterSpacing: 1.0,
              color: Colors.white60,
            ),
          ),
          const SizedBox(height: 3),
          Text(
            value,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 12,
              fontWeight: FontWeight.w800,
              color: valueColor,
            ),
          ),
        ],
      ),
    );
  }

  InputDecoration _fieldDeco(String label) => InputDecoration(
        labelText: label,
        labelStyle: GoogleFonts.plusJakartaSans(
          fontSize: 12,
          color: const Color(0xFF6B7368),
        ),
        filled: true,
        fillColor: const Color(0xFFF7F5EF),
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: Color(0xFFE2DDD1)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: Color(0xFFE2DDD1)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: Color(0xFFC5A880), width: 1.4),
        ),
      );
}
