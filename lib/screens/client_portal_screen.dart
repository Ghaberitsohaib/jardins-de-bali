// =========================================================================
// JARDINS DE BALI — ESPACE CLIENT VIP ULTRA PRO MAX
// Prospect VIP (Visite Privée, Simulateur VEFA/Crédit, Favoris)
// Propriétaire VIP (Mon Bien, Bilan Financier, Suivi Chantier, VEFA, Reçus)
// =========================================================================

import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/app_models.dart';
import '../models/user_account_model.dart';
import '../services/pdf_document_service.dart';
import '../state/app_state.dart';
import '../theme/imperial_theme.dart';
import 'lot_detail_screen.dart';

class ClientPortalScreen extends StatefulWidget {
  final AppState appState;

  const ClientPortalScreen({super.key, required this.appState});

  @override
  State<ClientPortalScreen> createState() => _ClientPortalScreenState();
}

class _ClientPortalScreenState extends State<ClientPortalScreen> {
  // Interactive VEFA & Bank Mortgage Simulator state
  double _simBudget = 1600000;

  // Quick Visit Booking state
  String _selectedSlot = '11h30';
  int _selectedDayOffset = 2; // 2 days from now

  String _formatDateOffset(int daysAhead) {
    final dt = DateTime.now().add(Duration(days: daysAhead));
    return '${dt.year}-${dt.month.toString().padLeft(2, '0')}-${dt.day.toString().padLeft(2, '0')}';
  }

  String _formatFriendlyDay(int daysAhead) {
    final dt = DateTime.now().add(Duration(days: daysAhead));
    const months = [
      'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
      'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'
    ];
    return '${dt.day.toString().padLeft(2, '0')} ${months[dt.month - 1]}';
  }

  double _computeMonthlyMortgage(double loanAmount,
      {double annualRate = 0.045, int years = 20}) {
    final r = annualRate / 12.0;
    final n = years * 12;
    final factor = math.pow(1 + r, n).toDouble();
    return loanAmount * (r * factor) / (factor - 1);
  }

  Future<void> _contactAdvisorWhatsApp(UserAccount user) async {
    final lotRef =
        user.hasAssignedLot ? ' concernant mon lot ${user.assignedLotId}' : '';
    final msg =
        'Bonjour BaytImmo Prestige, je suis ${user.name} (${user.email})$lotRef. Je souhaite échanger avec mon conseiller privé.';
    final uri = Uri.parse(
      'https://wa.me/212665644391?text=${Uri.encodeComponent(msg)}',
    );
    await launchUrl(uri, mode: LaunchMode.externalApplication);
  }

  void _openPlanSheet(BuildContext context, ResidenceLot lot) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => Scaffold(
          backgroundColor: ImperialColors.primary,
          appBar: AppBar(
            backgroundColor: ImperialColors.primary,
            iconTheme: const IconThemeData(color: Colors.white),
            title: Text(
              'PLAN OFFICIEL — ${lot.id}',
              style: ImperialTheme.displayStyle(
                fontSize: 15,
                color: ImperialColors.accent,
              ),
            ),
          ),
          body: InteractiveViewer(
            minScale: 0.7,
            maxScale: 5.0,
            child: Center(
              child: SmartAssetImage(
                localPath: lot.assets.planLocalPath,
                remoteUrl: lot.assets.planRemoteUrl,
                fit: BoxFit.contain,
              ),
            ),
          ),
        ),
      ),
    );
  }

  Future<void> _submitVisitBooking(UserAccount user) async {
    HapticFeedback.mediumImpact();
    final dateStr = _formatDateOffset(_selectedDayOffset);
    final favs = widget.appState.favoriteLots;
    final lotInterest = user.hasAssignedLot
        ? 'Visite chantier — ${user.assignedLotId}'
        : (favs.isNotEmpty
            ? favs.first.title
            : 'Découverte Appartement Témoin');

    final ok = await widget.appState.bookVisit(
      date: dateStr,
      timeSlot: _selectedSlot,
      lotInterest: lotInterest,
      notes: 'Réservation directe depuis Espace VIP',
    );

    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: const Color(0xFF131A12),
        behavior: SnackBarBehavior.floating,
        content: Text(
          ok
              ? 'Visite VIP demandée pour le ${_formatFriendlyDay(_selectedDayOffset)} à $_selectedSlot.'
              : 'Impossible d\'enregistrer le rendez-vous.',
          style: const TextStyle(color: Color(0xFFDFBA73)),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: widget.appState,
      builder: (context, _) {
        final user = widget.appState.currentUser;
        if (user == null) {
          return const Scaffold(
            backgroundColor: ImperialColors.background,
            body: Center(child: Text('Session expirée')),
          );
        }

        final assignedLot = widget.appState.findLotById(user.assignedLotId);
        final fp = user.financialProfile;
        final pctInt = (fp.progressPercent * 100).round();
        final myVisits = widget.appState.myVisits;
        final favLots = widget.appState.favoriteLots;
        final chantier = widget.appState.chantierProgress;

        return Scaffold(
          backgroundColor: ImperialColors.background,
          body: Column(
            children: [
              // Ultra-Luxury Header
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
                                border: Border.all(
                                  color: Colors.white.withValues(alpha: 0.14),
                                ),
                              ),
                              child: const Icon(
                                Icons.arrow_back_ios_new_rounded,
                                size: 15,
                                color: Colors.white,
                              ),
                            ),
                          ),
                          Text(
                            user.hasAssignedLot
                                ? 'PROPRIÉTAIRE VIP • BAYTIMMO'
                                : 'ESPACE PROSPECT VIP',
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 9.5,
                              fontWeight: FontWeight.w700,
                              letterSpacing: 1.9,
                              color: const Color(0xFFDFBA73),
                            ),
                          ),
                          GestureDetector(
                            onTap: () async {
                              await widget.appState.logout();
                              if (context.mounted) Navigator.of(context).pop();
                            },
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 10, vertical: 6),
                              decoration: BoxDecoration(
                                color: Colors.white.withValues(alpha: 0.08),
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: Colors.white.withValues(alpha: 0.14),
                                ),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Icon(Icons.logout_rounded,
                                      size: 13, color: Color(0xFFDFBA73)),
                                  const SizedBox(width: 4),
                                  Text(
                                    'Sortir',
                                    style: GoogleFonts.plusJakartaSans(
                                      fontSize: 10.5,
                                      fontWeight: FontWeight.w700,
                                      color: Colors.white,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),
                      Text(
                        'Bonjour, ${user.name}',
                        style: GoogleFonts.playfairDisplay(
                          fontSize: 21,
                          fontWeight: FontWeight.w700,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        '${user.email} • ${user.phone}',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 11,
                          color: const Color(0xFFA5B0A2),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // Body Content
              Expanded(
                child: ListView(
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 40),
                  children: [
                    if (user.hasAssignedLot) ...[
                      // === OWNER VIEW ===
                      _buildAssignedLotCard(context, user, assignedLot),
                      const SizedBox(height: 16),
                      _buildFinancialSummaryCard(fp, pctInt),
                      const SizedBox(height: 16),
                      _buildChantierProgressCard(chantier),
                      const SizedBox(height: 16),
                      _buildVefaTimelineCard(fp),
                      const SizedBox(height: 16),
                      _buildPaymentHistoryCard(context, user, assignedLot, fp),
                      const SizedBox(height: 16),
                      _buildVisitBookingCard(user, myVisits,
                          title: 'Planifier une Visite de Chantier'),
                    ] else ...[
                      // === PROSPECT VIP VIEW (3 RICH INTERACTIVE MODULES) ===
                      _buildVisitBookingCard(user, myVisits,
                          title: 'Réserver une Visite Privée VIP'),
                      const SizedBox(height: 16),
                      _buildVefaSimulatorCard(),
                      const SizedBox(height: 16),
                      _buildFavoritesShowcaseCard(context, favLots),
                    ],

                    const SizedBox(height: 18),

                    // Direct WhatsApp Private Advisor CTA
                    Container(
                      width: double.infinity,
                      height: 52,
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [
                            Color(0xFFE8CC95),
                            Color(0xFFC5A880),
                            Color(0xFFA58557),
                          ],
                        ),
                        borderRadius: BorderRadius.circular(26),
                        boxShadow: [
                          BoxShadow(
                            color:
                                const Color(0xFFC5A880).withValues(alpha: 0.4),
                            blurRadius: 14,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Material(
                        color: Colors.transparent,
                        child: InkWell(
                          borderRadius: BorderRadius.circular(26),
                          onTap: () => _contactAdvisorWhatsApp(user),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.chat_bubble_outline_rounded,
                                  size: 18, color: Color(0xFF0E140D)),
                              const SizedBox(width: 8),
                              Text(
                                'CONTACTER MON CONSEILLER PRIVÉ',
                                style: GoogleFonts.plusJakartaSans(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w800,
                                  letterSpacing: 1.0,
                                  color: const Color(0xFF0E140D),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  // -------------------------------------------------------------------------
  // MODULE: VISITE PRIVÉE VIP (BOOKING + LIVE STATUS FROM ADMIN)
  // -------------------------------------------------------------------------
  Widget _buildVisitBookingCard(
    UserAccount user,
    List<VisitBooking> myVisits, {
    required String title,
  }) {
    final dayOffsets = [1, 2, 3, 5, 7];
    final slots = ['10h00', '11h30', '15h00', '17h00'];

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFFEAE5DA)),
        boxShadow: ImperialTheme.modernCardShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: const Color(0xFF131A12),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.calendar_month_rounded,
                    size: 18, color: Color(0xFFDFBA73)),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: GoogleFonts.playfairDisplay(
                        fontSize: 16.5,
                        fontWeight: FontWeight.w700,
                        color: const Color(0xFF111710),
                      ),
                    ),
                    Text(
                      'Bureau de Vente Menara • Quartier Rahham, Lot B5',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 10.5,
                        color: const Color(0xFF6B7368),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Text(
            'Choisissez une date',
            style: GoogleFonts.plusJakartaSans(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              color: const Color(0xFF434C41),
            ),
          ),
          const SizedBox(height: 8),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: dayOffsets.map((d) {
                final sel = _selectedDayOffset == d;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: GestureDetector(
                    onTap: () => setState(() => _selectedDayOffset = d),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      padding: const EdgeInsets.symmetric(
                          horizontal: 13, vertical: 8),
                      decoration: BoxDecoration(
                        color: sel
                            ? const Color(0xFF131A12)
                            : const Color(0xFFF7F5EF),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: sel
                              ? const Color(0xFFDFBA73)
                              : const Color(0xFFE2DDD1),
                        ),
                      ),
                      child: Text(
                        _formatFriendlyDay(d),
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 11.5,
                          fontWeight: FontWeight.w700,
                          color: sel
                              ? const Color(0xFFEFD39B)
                              : const Color(0xFF2B3429),
                        ),
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 12),
          Text(
            'Créneau horaire',
            style: GoogleFonts.plusJakartaSans(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              color: const Color(0xFF434C41),
            ),
          ),
          const SizedBox(height: 8),
          Row(
            children: slots.map((slot) {
              final sel = _selectedSlot == slot;
              return Expanded(
                child: Padding(
                  padding: EdgeInsets.only(right: slot == slots.last ? 0 : 6),
                  child: GestureDetector(
                    onTap: () => setState(() => _selectedSlot = slot),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      decoration: BoxDecoration(
                        color: sel
                            ? const Color(0xFFC5A880)
                            : const Color(0xFFF7F5EF),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(
                          color: sel
                              ? const Color(0xFF9E8055)
                              : const Color(0xFFE2DDD1),
                        ),
                      ),
                      child: Center(
                        child: Text(
                          slot,
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 11.5,
                            fontWeight: FontWeight.w800,
                            color: sel
                                ? const Color(0xFF0E140D)
                                : const Color(0xFF2B3429),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 14),
          SizedBox(
            width: double.infinity,
            height: 44,
            child: ElevatedButton.icon(
              onPressed: () => _submitVisitBooking(user),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF131A12),
                foregroundColor: const Color(0xFFDFBA73),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
              ),
              icon: const Icon(Icons.check_circle_outline_rounded, size: 17),
              label: Text(
                'DEMANDER CE RENDEZ-VOUS',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 11.5,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 0.9,
                ),
              ),
            ),
          ),
          if (myVisits.isNotEmpty) ...[
            const SizedBox(height: 14),
            const Divider(color: Color(0xFFEAE5DA)),
            const SizedBox(height: 8),
            Text(
              'MES RENDEZ-VOUS (${myVisits.length})',
              style: GoogleFonts.plusJakartaSans(
                fontSize: 10,
                fontWeight: FontWeight.w800,
                letterSpacing: 1.2,
                color: const Color(0xFF8C6D42),
              ),
            ),
            const SizedBox(height: 8),
            ...myVisits.take(3).map((v) {
              final isConfirmed = v.status == 'Confirmé';
              final isDone = v.status == 'Terminé';
              final bg = isConfirmed
                  ? const Color(0xFFE8F5E9)
                  : (isDone
                      ? const Color(0xFFECEFF1)
                      : const Color(0xFFFFF3E0));
              final fg = isConfirmed
                  ? const Color(0xFF2E7D32)
                  : (isDone
                      ? const Color(0xFF546E7A)
                      : const Color(0xFFED6C02));
              return Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(11),
                decoration: BoxDecoration(
                  color: const Color(0xFFFBF9F4),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFFEAE5DA)),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '${v.date} à ${v.timeSlot}',
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 12,
                              fontWeight: FontWeight.w800,
                              color: const Color(0xFF141A13),
                            ),
                          ),
                          if (v.lotInterest.isNotEmpty)
                            Text(
                              v.lotInterest,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 10.5,
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
                        color: bg,
                        borderRadius: BorderRadius.circular(99),
                      ),
                      child: Text(
                        isConfirmed ? 'Confirmé ✓' : v.status,
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          color: fg,
                        ),
                      ),
                    ),
                  ],
                ),
              );
            }),
          ],
        ],
      ),
    );
  }

  // -------------------------------------------------------------------------
  // MODULE: SIMULATEUR VEFA & FINANCEMENT BANCAIRE (PROSPECT VIP)
  // -------------------------------------------------------------------------
  Widget _buildVefaSimulatorCard() {
    final t1 = _simBudget * 0.20;
    final t2 = _simBudget * 0.20;
    final t3 = _simBudget * 0.30;
    final t4 = _simBudget * 0.30;
    // Assume 70% mortgage over 20 years at 4.5%
    final monthly = _computeMonthlyMortgage(_simBudget * 0.70);

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF111710), Color(0xFF1B2419)],
        ),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: const Color(0xFFC5A880).withValues(alpha: 0.35),
        ),
        boxShadow: ImperialTheme.modernCardShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'SIMULATEUR VEFA & CRÉDIT',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 10,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 1.6,
                  color: const Color(0xFFDFBA73),
                ),
              ),
              Text(
                'LOI 107-12',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 9.5,
                  fontWeight: FontWeight.w700,
                  color: Colors.white54,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                'Budget estimé',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 11.5,
                  color: Colors.white70,
                ),
              ),
              Text(
                formatMadAmount(_simBudget),
                style: GoogleFonts.playfairDisplay(
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                  color: const Color(0xFFEFD39B),
                ),
              ),
            ],
          ),
          SliderTheme(
            data: SliderTheme.of(context).copyWith(
              activeTrackColor: const Color(0xFFDFBA73),
              inactiveTrackColor: Colors.white.withValues(alpha: 0.14),
              thumbColor: const Color(0xFFEFD39B),
              overlayColor: const Color(0xFFDFBA73).withValues(alpha: 0.2),
            ),
            child: Slider(
              min: 800000,
              max: 4000000,
              divisions: 64,
              value: _simBudget,
              onChanged: (v) => setState(() => _simBudget = v),
            ),
          ),
          const SizedBox(height: 6),
          Row(
            children: [
              Expanded(child: _simTrancheBox('1. Réservation (20%)', t1)),
              const SizedBox(width: 8),
              Expanded(child: _simTrancheBox('2. Fondations (20%)', t2)),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(child: _simTrancheBox('3. Gros Œuvre (30%)', t3)),
              const SizedBox(width: 8),
              Expanded(child: _simTrancheBox('4. Remise Clés (30%)', t4)),
            ],
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            decoration: BoxDecoration(
              color: const Color(0xFFDFBA73).withValues(alpha: 0.14),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(
                color: const Color(0xFFDFBA73).withValues(alpha: 0.35),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Mensualité banque estimée (70% / 20 ans)',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 10.5,
                    color: Colors.white70,
                  ),
                ),
                Text(
                  '${formatMadAmount(monthly)}/mois',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 12,
                    fontWeight: FontWeight.w800,
                    color: const Color(0xFFEFD39B),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _simTrancheBox(String label, double amount) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.06),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 9.5,
              color: Colors.white60,
            ),
          ),
          const SizedBox(height: 3),
          Text(
            formatMadAmount(amount),
            style: GoogleFonts.plusJakartaSans(
              fontSize: 12.5,
              fontWeight: FontWeight.w800,
              color: Colors.white,
            ),
          ),
        ],
      ),
    );
  }

  // -------------------------------------------------------------------------
  // MODULE: MA SÉLECTION (FAVORIS PROSPECT)
  // -------------------------------------------------------------------------
  Widget _buildFavoritesShowcaseCard(
    BuildContext context,
    List<ResidenceLot> favLots,
  ) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
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
                'Ma Sélection (${favLots.length})',
                style: GoogleFonts.playfairDisplay(
                  fontSize: 17,
                  fontWeight: FontWeight.w700,
                  color: const Color(0xFF111710),
                ),
              ),
              TextButton(
                onPressed: () {
                  widget.appState.setTabIndex(1);
                  Navigator.of(context).pop();
                },
                child: Text(
                  'Explorer les 230 lots',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: const Color(0xFF8C6D42),
                  ),
                ),
              ),
            ],
          ),
          if (favLots.isEmpty)
            Text(
              'Ajoutez des appartements en favori (❤️) dans le catalogue pour les retrouver et les comparer ici.',
              style: GoogleFonts.plusJakartaSans(
                fontSize: 11.5,
                color: const Color(0xFF6B7368),
                height: 1.45,
              ),
            )
          else
            SizedBox(
              height: 138,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: favLots.length,
                itemBuilder: (_, idx) {
                  final lot = favLots[idx];
                  return GestureDetector(
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (_) => LotDetailScreen(
                            lot: lot,
                            appState: widget.appState,
                          ),
                        ),
                      );
                    },
                    child: Container(
                      width: 190,
                      margin: const EdgeInsets.only(right: 10),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFBF9F4),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFFEAE5DA)),
                      ),
                      clipBehavior: Clip.antiAlias,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          SmartAssetImage(
                            localPath: lot.assets.thumbLocalPath,
                            remoteUrl: lot.assets.thumbRemoteUrl,
                            height: 78,
                            width: double.infinity,
                            fit: BoxFit.cover,
                          ),
                          Padding(
                            padding: const EdgeInsets.all(8),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  lot.title,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: GoogleFonts.plusJakartaSans(
                                    fontSize: 11.5,
                                    fontWeight: FontWeight.w800,
                                    color: const Color(0xFF141A13),
                                  ),
                                ),
                                Text(
                                  '${lot.surfaceFormatted} • ${lot.floorName}',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: GoogleFonts.plusJakartaSans(
                                    fontSize: 10,
                                    color: const Color(0xFF8C6D42),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
        ],
      ),
    );
  }

  // -------------------------------------------------------------------------
  // MODULE: SUIVI CHANTIER EN DIRECT (PROPRIÉTAIRE VIP)
  // -------------------------------------------------------------------------
  Widget _buildChantierProgressCard(ChantierProgress chantier) {
    final phases = ChantierProgress.officialPhases;
    final doneCount = chantier.completedPhases;

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
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
                'Suivi Chantier en Direct',
                style: GoogleFonts.playfairDisplay(
                  fontSize: 17,
                  fontWeight: FontWeight.w700,
                  color: const Color(0xFF111710),
                ),
              ),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFF131A12),
                  borderRadius: BorderRadius.circular(99),
                ),
                child: Text(
                  '${chantier.progressPercent}%',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                    color: const Color(0xFFDFBA73),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            'Phase active : ${chantier.currentPhase} • MàJ ${chantier.lastUpdate}',
            style: GoogleFonts.plusJakartaSans(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: const Color(0xFF8C6D42),
            ),
          ),
          const SizedBox(height: 12),
          ClipRRect(
            borderRadius: BorderRadius.circular(99),
            child: LinearProgressIndicator(
              value: chantier.progressPercent / 100.0,
              minHeight: 7,
              backgroundColor: const Color(0xFFEEE9DF),
              valueColor:
                  const AlwaysStoppedAnimation<Color>(Color(0xFFC5A880)),
            ),
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 6,
            runSpacing: 6,
            children: List.generate(phases.length, (i) {
              final reached = i < doneCount;
              return Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 9, vertical: 5),
                decoration: BoxDecoration(
                  color: reached
                      ? const Color(0xFFE8F5E9)
                      : const Color(0xFFF7F5EF),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    color: reached
                        ? const Color(0xFF81C784)
                        : const Color(0xFFE2DDD1),
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      reached
                          ? Icons.check_circle_rounded
                          : Icons.radio_button_unchecked_rounded,
                      size: 13,
                      color: reached
                          ? const Color(0xFF2E7D32)
                          : const Color(0xFF8C9289),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      phases[i],
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 10,
                        fontWeight: FontWeight.w700,
                        color: reached
                            ? const Color(0xFF1B5E20)
                            : const Color(0xFF6B7368),
                      ),
                    ),
                  ],
                ),
              );
            }),
          ),
        ],
      ),
    );
  }

  Widget _buildAssignedLotCard(
    BuildContext context,
    UserAccount user,
    ResidenceLot? lot,
  ) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFFEAE5DA)),
        boxShadow: ImperialTheme.modernCardShadow,
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (lot != null)
            Stack(
              children: [
                SmartAssetImage(
                  localPath: lot.assets.thumbLocalPath,
                  remoteUrl: lot.assets.thumbRemoteUrl,
                  height: 165,
                  width: double.infinity,
                  fit: BoxFit.cover,
                ),
                Positioned(
                  top: 12,
                  left: 12,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0E140D).withValues(alpha: 0.9),
                      borderRadius: BorderRadius.circular(99),
                      border: Border.all(
                        color: const Color(0xFFDFBA73).withValues(alpha: 0.6),
                      ),
                    ),
                    child: Text(
                      'MON BIEN • ${lot.id}',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 10,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 1.0,
                        color: const Color(0xFFDFBA73),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          Padding(
            padding: const EdgeInsets.all(18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  lot?.title ?? 'Lot ${user.assignedLotId}',
                  style: GoogleFonts.playfairDisplay(
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    color: const Color(0xFF111710),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  lot != null
                      ? '${lot.floorName} • ${lot.surfaceFormatted}'
                      : 'Jardins de Bali Marrakech Menara • TF 34 603/M',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: const Color(0xFF8C6D42),
                  ),
                ),
                if (lot != null) ...[
                  const SizedBox(height: 6),
                  Text(
                    lot.roomsText,
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 11.5,
                      color: const Color(0xFF555E53),
                    ),
                  ),
                  const SizedBox(height: 14),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () => _openPlanSheet(context, lot),
                          style: OutlinedButton.styleFrom(
                            foregroundColor: const Color(0xFF141A13),
                            side: const BorderSide(color: Color(0xFFC5A880)),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14),
                            ),
                            padding: const EdgeInsets.symmetric(vertical: 11),
                          ),
                          icon: const Icon(Icons.architecture_rounded,
                              size: 16, color: Color(0xFF8C6D42)),
                          label: Text(
                            'Plan 2D',
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 11.5,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () {
                            Navigator.of(context).push(
                              MaterialPageRoute(
                                builder: (_) => LotDetailScreen(
                                  lot: lot,
                                  appState: widget.appState,
                                ),
                              ),
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF111710),
                            foregroundColor: const Color(0xFFDFBA73),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14),
                            ),
                            padding: const EdgeInsets.symmetric(vertical: 11),
                          ),
                          icon: const Icon(Icons.visibility_rounded, size: 16),
                          label: Text(
                            'Fiche Complète',
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 11.5,
                              fontWeight: FontWeight.w700,
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
        ],
      ),
    );
  }

  Widget _buildFinancialSummaryCard(ClientFinancialProfile fp, int pctInt) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF111710), Color(0xFF1B2419)],
        ),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: const Color(0xFFC5A880).withValues(alpha: 0.35),
        ),
        boxShadow: ImperialTheme.modernCardShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'BILAN FINANCIER & CRÉDIT',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 10,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 1.6,
                  color: const Color(0xFFDFBA73),
                ),
              ),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFFDFBA73).withValues(alpha: 0.18),
                  borderRadius: BorderRadius.circular(99),
                ),
                child: Text(
                  '$pctInt% RÉGLÉ',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 10,
                    fontWeight: FontWeight.w800,
                    color: const Color(0xFFEFD39B),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Text(
            'Prix Total Convenu',
            style: GoogleFonts.plusJakartaSans(
              fontSize: 11,
              color: Colors.white60,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            formatMadAmount(fp.totalPrice),
            style: GoogleFonts.playfairDisplay(
              fontSize: 25,
              fontWeight: FontWeight.w700,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 14),
          ClipRRect(
            borderRadius: BorderRadius.circular(99),
            child: LinearProgressIndicator(
              value: fp.progressPercent,
              minHeight: 8,
              backgroundColor: Colors.white.withValues(alpha: 0.12),
              valueColor:
                  const AlwaysStoppedAnimation<Color>(Color(0xFFDFBA73)),
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: _financeStatBox(
                  label: 'MONTANT PAYÉ',
                  value: formatMadAmount(fp.paidAmount),
                  accent: const Color(0xFF8CE29E),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _financeStatBox(
                  label: 'RESTE À PAYER',
                  value: formatMadAmount(fp.remainingAmount),
                  accent: const Color(0xFFEFD39B),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _financeStatBox({
    required String label,
    required String value,
    required Color accent,
  }) {
    return Container(
      padding: const EdgeInsets.all(12),
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
              fontSize: 9,
              fontWeight: FontWeight.w700,
              letterSpacing: 1.0,
              color: Colors.white60,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 13.5,
              fontWeight: FontWeight.w800,
              color: accent,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildVefaTimelineCard(ClientFinancialProfile fp) {
    final completed = fp.completedVefaMilestones;
    final steps = [
      ('Tranche 1 : Réservation', '20% du prix global'),
      ('Tranche 2 : Fondations & Sous-sol', '20% à l\'achèvement'),
      ('Tranche 3 : Gros Œuvre & Toiture', '30% avancement structure'),
      ('Tranche 4 : Finitions & Remise des Clés', '30% acte notarié final'),
    ];

    return Container(
      padding: const EdgeInsets.all(18),
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
            'Échéancier VEFA (Loi 107-12)',
            style: GoogleFonts.playfairDisplay(
              fontSize: 17,
              fontWeight: FontWeight.w700,
              color: const Color(0xFF111710),
            ),
          ),
          const SizedBox(height: 12),
          ...List.generate(steps.length, (i) {
            final isDone = i < completed;
            final isCurrent = i == completed && completed < steps.length;
            final badgeLabel =
                isDone ? 'Payé' : (isCurrent ? 'En cours' : 'À venir');
            final badgeBg = isDone
                ? const Color(0xFFE8F5E9)
                : (isCurrent
                    ? const Color(0xFFFFF3E0)
                    : const Color(0xFFF3F1EC));
            final badgeFg = isDone
                ? const Color(0xFF2E7D32)
                : (isCurrent
                    ? const Color(0xFFED6C02)
                    : const Color(0xFF7B8279));

            return Padding(
              padding: EdgeInsets.only(bottom: i < steps.length - 1 ? 12 : 0),
              child: Row(
                children: [
                  Container(
                    width: 28,
                    height: 28,
                    decoration: BoxDecoration(
                      color: isDone
                          ? const Color(0xFF141C13)
                          : (isCurrent
                              ? const Color(0xFFC5A880)
                              : const Color(0xFFEFECE4)),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      isDone
                          ? Icons.check_rounded
                          : (isCurrent
                              ? Icons.timelapse_rounded
                              : Icons.schedule_rounded),
                      size: 15,
                      color: isDone
                          ? const Color(0xFFDFBA73)
                          : (isCurrent
                              ? const Color(0xFF111710)
                              : const Color(0xFF8C9289)),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          steps[i].$1,
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 12.5,
                            fontWeight: FontWeight.w700,
                            color: const Color(0xFF141A13),
                          ),
                        ),
                        Text(
                          steps[i].$2,
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 11,
                            color: const Color(0xFF6B7368),
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
                    decoration: BoxDecoration(
                      color: badgeBg,
                      borderRadius: BorderRadius.circular(99),
                    ),
                    child: Text(
                      badgeLabel,
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 10,
                        fontWeight: FontWeight.w700,
                        color: badgeFg,
                      ),
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildPaymentHistoryCard(
    BuildContext context,
    UserAccount user,
    ResidenceLot? lot,
    ClientFinancialProfile fp,
  ) {
    return Container(
      padding: const EdgeInsets.all(18),
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
            'Reçus & Versements Enregistrés',
            style: GoogleFonts.playfairDisplay(
              fontSize: 17,
              fontWeight: FontWeight.w700,
              color: const Color(0xFF111710),
            ),
          ),
          const SizedBox(height: 12),
          if (fp.payments.isEmpty)
            Text(
              'Aucun versement enregistré pour le moment.',
              style: GoogleFonts.plusJakartaSans(
                fontSize: 12,
                color: const Color(0xFF7B8279),
              ),
            )
          else
            ...fp.payments.map((p) {
              return Container(
                margin: const EdgeInsets.only(bottom: 10),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFFBF9F4),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFFEAE5DA)),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 38,
                      height: 38,
                      decoration: BoxDecoration(
                        color: const Color(0xFF131A12),
                        borderRadius: BorderRadius.circular(11),
                      ),
                      child: const Icon(
                        Icons.receipt_long_rounded,
                        size: 18,
                        color: Color(0xFFDFBA73),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            p.trancheLabel,
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: const Color(0xFF141A13),
                            ),
                          ),
                          Text(
                            '${p.date} • ${p.method} • ${p.receiptRef}',
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 10.5,
                              color: const Color(0xFF6B7368),
                            ),
                          ),
                        ],
                      ),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          formatMadAmount(p.amount),
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 12,
                            fontWeight: FontWeight.w800,
                            color: const Color(0xFF2E7D32),
                          ),
                        ),
                        InkWell(
                          onTap: () => PdfDocumentService.openPaymentReceiptPdf(
                            user: user,
                            payment: p,
                            lot: lot,
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(
                                Icons.picture_as_pdf_rounded,
                                size: 12,
                                color: Color(0xFF8C6D42),
                              ),
                              const SizedBox(width: 3),
                              Text(
                                'Reçu PDF',
                                style: GoogleFonts.plusJakartaSans(
                                  fontSize: 10.5,
                                  fontWeight: FontWeight.w700,
                                  color: const Color(0xFF8C6D42),
                                  decoration: TextDecoration.underline,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              );
            }),
        ],
      ),
    );
  }
}
