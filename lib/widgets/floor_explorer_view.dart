// =========================================================================
// JARDINS DE BALI — INTERACTIVE FLOOR EXPLORER (EXPLORATEUR PAR ÉTAGE)
// Select floor RDC..5ème, view live availability matrix, tap any unit
// =========================================================================

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/app_models.dart';
import '../screens/lot_detail_screen.dart';
import '../services/pdf_document_service.dart';
import '../state/app_state.dart';
import '../theme/imperial_theme.dart';

class FloorExplorerView extends StatefulWidget {
  final AppState appState;

  const FloorExplorerView({super.key, required this.appState});

  @override
  State<FloorExplorerView> createState() => _FloorExplorerViewState();
}

class _FloorExplorerViewState extends State<FloorExplorerView> {
  int _selectedFloor = 0;

  static const List<(int, String, String)> _floorsMeta = [
    (0, 'RDC', 'Rez-de-Chaussée & Duplex'),
    (1, '1er', '1er Étage'),
    (2, '2ème', '2ème Étage'),
    (3, '3ème', '3ème Étage'),
    (4, '4ème', '4ème Étage'),
    (5, '5ème', '5ème Étage • Terrasses'),
  ];

  Color _statusBg(String status) {
    switch (status) {
      case 'Disponible':
        return const Color(0xFFE7F5EC);
      case 'Réservé':
        return const Color(0xFFFFF5E0);
      default:
        return const Color(0xFFF1EFEA);
    }
  }

  Color _statusBorder(String status) {
    switch (status) {
      case 'Disponible':
        return const Color(0xFF2E7D32);
      case 'Réservé':
        return const Color(0xFFC5963E);
      default:
        return const Color(0xFFD5CFC4);
    }
  }

  Color _statusText(String status) {
    switch (status) {
      case 'Disponible':
        return const Color(0xFF1B5E20);
      case 'Réservé':
        return const Color(0xFF9C6B17);
      default:
        return const Color(0xFF7A7D77);
    }
  }

  String _shortCategory(String cat) {
    if (cat == 'Duplex') return 'Duplex';
    if (cat.startsWith('1')) return '1 Ch';
    if (cat.startsWith('2')) return '2 Ch';
    if (cat.startsWith('3')) return '3 Ch';
    return cat;
  }

  void _openQuickLotSheet(BuildContext context, ResidenceLot lot) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (ctx) => Container(
        margin: const EdgeInsets.fromLTRB(12, 0, 12, 16),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: const Color(0xFFFCFBF7),
          borderRadius: BorderRadius.circular(28),
          border: Border.all(
            color: const Color(0xFFC5A880).withValues(alpha: 0.4),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.28),
              blurRadius: 28,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: SafeArea(
          top: false,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  margin: const EdgeInsets.only(bottom: 14),
                  decoration: BoxDecoration(
                    color: const Color(0xFFD8D2C5),
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          lot.id,
                          style: GoogleFonts.playfairDisplay(
                            fontSize: 22,
                            fontWeight: FontWeight.w700,
                            color: const Color(0xFF111710),
                          ),
                        ),
                        Text(
                          '${lot.category} • ${lot.floorName}',
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 12,
                            color: const Color(0xFF6B7368),
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 11,
                      vertical: 5,
                    ),
                    decoration: BoxDecoration(
                      color: _statusBg(lot.status),
                      borderRadius: BorderRadius.circular(99),
                      border: Border.all(
                        color: _statusBorder(lot.status).withValues(alpha: 0.45),
                      ),
                    ),
                    child: Text(
                      lot.status,
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: _statusText(lot.status),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              // Plan 2D Mini Preview
              ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: Container(
                  height: 170,
                  width: double.infinity,
                  color: Colors.white,
                  child: SmartAssetImage(
                    localPath: lot.assets.planLocalPath,
                    remoteUrl: lot.assets.planRemoteUrl,
                    fit: BoxFit.contain,
                  ),
                ),
              ),
              const SizedBox(height: 14),
              Row(
                children: [
                  _miniStat(Icons.square_foot_rounded, lot.surfaceFormatted),
                  const SizedBox(width: 8),
                  _miniStat(Icons.king_bed_outlined, '${lot.bedrooms} Ch.'),
                  const SizedBox(width: 8),
                  _miniStat(Icons.landscape_outlined, lot.view),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () async {
                        Navigator.of(ctx).pop();
                        await PdfDocumentService.openLotBrochurePdf(lot: lot);
                      },
                      icon: const Icon(Icons.picture_as_pdf_rounded, size: 16),
                      label: const Text('Fiche PDF'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: const Color(0xFF141A13),
                        side: const BorderSide(color: Color(0xFFC5A880)),
                        padding: const EdgeInsets.symmetric(vertical: 13),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    flex: 2,
                    child: ElevatedButton.icon(
                      onPressed: () {
                        Navigator.of(ctx).pop();
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (_) => LotDetailScreen(
                              lot: lot,
                              appState: widget.appState,
                            ),
                          ),
                        );
                      },
                      icon: const Icon(Icons.open_in_new_rounded, size: 16),
                      label: const Text('VOIR LE LOT COMPLET'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF111710),
                        foregroundColor: const Color(0xFFDFBA73),
                        padding: const EdgeInsets.symmetric(vertical: 13),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
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
    );
  }

  Widget _miniStat(IconData icon, String label) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 7),
        decoration: BoxDecoration(
          color: const Color(0xFFF5F2EA),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Row(
          children: [
            Icon(icon, size: 13, color: const Color(0xFF9E7D4E)),
            const SizedBox(width: 5),
            Expanded(
              child: Text(
                label,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 10,
                  fontWeight: FontWeight.w600,
                  color: const Color(0xFF2B332A),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final all = widget.appState.allResidences;
    final floorLots = all.where((l) => l.floor == _selectedFloor).toList()
      ..sort((a, b) {
        final na = int.tryParse(a.id.replaceAll(RegExp(r'[^0-9]'), '')) ?? 0;
        final nb = int.tryParse(b.id.replaceAll(RegExp(r'[^0-9]'), '')) ?? 0;
        return na.compareTo(nb);
      });

    final dispoCount = floorLots.where((l) => l.status == 'Disponible').length;
    final resCount = floorLots.where((l) => l.status == 'Réservé').length;
    final venduCount = floorLots.where((l) => l.status == 'Vendu').length;
    final floorMeta = _floorsMeta.firstWhere(
      (f) => f.$1 == _selectedFloor,
      orElse: () => _floorsMeta.first,
    );

    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 14, 16, 150),
      children: [
        // 1. Visual Building Elevation Bar (RDC -> 5ème)
        Container(
          padding: const EdgeInsets.all(14),
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
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'SÉLECTEUR D\'ÉTAGE',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 10,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 1.6,
                      color: const Color(0xFF9E7D4E),
                    ),
                  ),
                  Text(
                    '${floorLots.length} lots au ${floorMeta.$2}',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: const Color(0xFF141A13),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: _floorsMeta.map((meta) {
                    final isSelected = _selectedFloor == meta.$1;
                    final countDispo = all
                        .where((l) => l.floor == meta.$1 && l.status == 'Disponible')
                        .length;
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: GestureDetector(
                        onTap: () => setState(() => _selectedFloor = meta.$1),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 220),
                          padding: const EdgeInsets.symmetric(
                            horizontal: 14,
                            vertical: 10,
                          ),
                          decoration: BoxDecoration(
                            color: isSelected
                                ? const Color(0xFF111710)
                                : const Color(0xFFF7F4EC),
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(
                              color: isSelected
                                  ? const Color(0xFFC5A880)
                                  : const Color(0xFFE4DEC9),
                            ),
                          ),
                          child: Column(
                            children: [
                              Text(
                                meta.$2,
                                style: GoogleFonts.playfairDisplay(
                                  fontSize: 14.5,
                                  fontWeight: FontWeight.w700,
                                  color: isSelected
                                      ? const Color(0xFFDFBA73)
                                      : const Color(0xFF141A13),
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                '$countDispo dispo',
                                style: GoogleFonts.plusJakartaSans(
                                  fontSize: 9.5,
                                  fontWeight: FontWeight.w700,
                                  color: countDispo > 0
                                      ? (isSelected
                                          ? const Color(0xFF8CE29E)
                                          : const Color(0xFF2E7D32))
                                      : const Color(0xFF8C9289),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),
              const SizedBox(height: 12),
              // Legend + Live floor breakdown
              Row(
                children: [
                  _legendDot(const Color(0xFF2E7D32), 'Disponible ($dispoCount)'),
                  const SizedBox(width: 12),
                  _legendDot(const Color(0xFFC5963E), 'Réservé ($resCount)'),
                  const SizedBox(width: 12),
                  _legendDot(const Color(0xFF9EA29C), 'Vendu ($venduCount)'),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // 2. Floor Title Banner
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                floorMeta.$3,
                style: GoogleFonts.playfairDisplay(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: const Color(0xFF111710),
                ),
              ),
              Text(
                'Appuyez sur un lot',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 11,
                  color: const Color(0xFF7B8279),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 10),

        // 3. Architectural Color-Coded Unit Matrix
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: floorLots.length,
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 3,
            mainAxisSpacing: 10,
            crossAxisSpacing: 10,
            childAspectRatio: 1.08,
          ),
          itemBuilder: (context, index) {
            final lot = floorLots[index];
            final isAvailable = lot.status == 'Disponible';
            return GestureDetector(
              onTap: () => _openQuickLotSheet(context, lot),
              child: Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: _statusBg(lot.status),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: _statusBorder(lot.status)
                        .withValues(alpha: isAvailable ? 0.65 : 0.35),
                    width: isAvailable ? 1.4 : 1.0,
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          lot.id.replaceFirst('APP ', '#'),
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 13.5,
                            fontWeight: FontWeight.w800,
                            color: const Color(0xFF111710),
                          ),
                        ),
                        Container(
                          width: 8,
                          height: 8,
                          decoration: BoxDecoration(
                            color: _statusBorder(lot.status),
                            shape: BoxShape.circle,
                          ),
                        ),
                      ],
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '${lot.surface.round()} m²',
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 11.5,
                            fontWeight: FontWeight.w700,
                            color: _statusText(lot.status),
                          ),
                        ),
                        Text(
                          _shortCategory(lot.category),
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 10,
                            color: const Color(0xFF5D665B),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _legendDot(Color color, String label) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 8,
          height: 8,
          decoration: BoxDecoration(color: color, shape: BoxShape.circle),
        ),
        const SizedBox(width: 5),
        Text(
          label,
          style: GoogleFonts.plusJakartaSans(
            fontSize: 10.5,
            fontWeight: FontWeight.w600,
            color: const Color(0xFF434C41),
          ),
        ),
      ],
    );
  }
}
