// =========================================================================
// JARDINS DE BALI — TAB 3: COMMERCES & BUREAUX (BUSINESS SCREEN)
// 4 Flagships Boulevard M-16, Mezzanines, Corporate Suites, Rendement Locatif
// PRIX SUR DEMANDE • CONTACT DIRECT WHATSAPP
// =========================================================================

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/app_models.dart';
import '../state/app_state.dart';
import '../theme/imperial_theme.dart';

class BusinessScreen extends StatefulWidget {
  final AppState appState;

  const BusinessScreen({super.key, required this.appState});

  @override
  State<BusinessScreen> createState() => _BusinessScreenState();
}

class _BusinessScreenState extends State<BusinessScreen> {
  String _selectedCategory = 'Tous'; // 'Tous', 'Flagship221', 'Boutique56'

  List<RetailSpace> get _filteredSpaces {
    final list = widget.appState.bundle?.retailSpaces ?? [];
    if (_selectedCategory == 'Tous') return list;
    if (_selectedCategory == 'Flagship221') {
      return list.where((s) => s.surface >= 200).toList();
    }
    return list.where((s) => s.surface < 200).toList();
  }

  void _openDetailModal(RetailSpace space) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => _RetailDetailSheet(space: space, appState: widget.appState),
    );
  }

  Future<void> _contactCommerceWhatsApp(RetailSpace space) async {
    final msg =
        'Bonjour BaytImmo, je m\'intéresse à l\'espace commercial ${space.title} (${space.surfaceFormatted} sur Boulevard Menara). Pouvez-vous me communiquer les conditions locatives ou de vente et le dossier technique ?';
    final uri = Uri.parse('https://wa.me/212665644391?text=${Uri.encodeComponent(msg)}');
    await launchUrl(uri, mode: LaunchMode.externalApplication);
  }

  @override
  Widget build(BuildContext context) {
    final spaces = _filteredSpaces;
    final categories = ['Tous', 'Flagship221', 'Boutique56'];

    return Column(
      children: [
        // Ultra-Luxury Architectural Header (Identical style to Contact VIP)
        Container(
          width: double.infinity,
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                Color(0xFF0A0E09),
                Color(0xFF131A12),
              ],
            ),
            border: Border(
              bottom: BorderSide(
                color: const Color(0xFFC5A880).withValues(alpha: 0.22),
                width: 1,
              ),
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.22),
                blurRadius: 18,
                offset: const Offset(0, 6),
              ),
            ],
          ),
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
          child: SafeArea(
            bottom: false,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top Prestige Badge Row
                Text(
                  'BAYTIMMO PRESTIGE • MENARA',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 9.5,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 2.2,
                    color: const Color(0xFFDFBA73),
                  ),
                ),
                const SizedBox(height: 7),
                Text(
                  'Commerces Flagships',
                  style: GoogleFonts.playfairDisplay(
                    fontSize: 21.5,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                    letterSpacing: -0.2,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 2),
                Text(
                  '4 Grands Magasins (608 m² RDC & Mezz.) • TF 34 603/M',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 11,
                    fontWeight: FontWeight.w400,
                    color: const Color(0xFFA5B0A2),
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 14),
                // Modern Capsule Category Switcher (Identical to Contact VIP)
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  physics: const BouncingScrollPhysics(),
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  child: Row(
                    children: categories.map((cat) {
                      final label = cat == 'Tous'
                          ? 'Tous les Magasins (${widget.appState.bundle?.retailSpaces.length ?? 4})'
                          : (cat == 'Flagship221' ? 'Grands Flagships (221 m²)' : 'Boutiques Façade (83 m²)');
                      final icon = cat == 'Tous'
                          ? Icons.grid_view_rounded
                          : (cat == 'Flagship221' ? Icons.storefront_rounded : Icons.shopping_bag_rounded);
                      return Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: _buildLuxurySubTab(cat, icon, label),
                      );
                    }).toList(),
                  ),
                ),
              ],
            ),
          ),
        ),

        // Business Spaces List
        Expanded(
          child: spaces.isEmpty
              ? const Center(child: Text('Aucun espace trouvé'))
              : ListView.builder(
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 160),
                  itemCount: spaces.length,
                  itemBuilder: (context, index) {
                    final space = spaces[index];
                    return _buildBusinessCard(space, index);
                  },
                ),
        ),
      ],
    );
  }

  Widget _buildLuxurySubTab(String category, IconData icon, String label) {
    final isSelected = _selectedCategory == category;
    return GestureDetector(
      onTap: () {
        HapticFeedback.lightImpact();
        setState(() => _selectedCategory = category);
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 240),
        curve: Curves.easeOutCubic,
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8.5),
        decoration: BoxDecoration(
          gradient: isSelected
              ? const LinearGradient(
                  colors: [
                    Color(0xFFE8CC95),
                    Color(0xFFC5A880),
                    Color(0xFFA58557),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                )
              : null,
          color: isSelected ? null : Colors.white.withValues(alpha: 0.06),
          borderRadius: BorderRadius.circular(22),
          border: Border.all(
            color: isSelected
                ? const Color(0xFFFFE8B8).withValues(alpha: 0.8)
                : Colors.white.withValues(alpha: 0.1),
            width: 1,
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: const Color(0xFFC5A880).withValues(alpha: 0.45),
                    blurRadius: 12,
                    offset: const Offset(0, 3),
                  ),
                ]
              : null,
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 14,
              color: isSelected ? const Color(0xFF0D120C) : const Color(0xFFDFBA73),
            ),
            const SizedBox(width: 6),
            Text(
              label,
              style: GoogleFonts.plusJakartaSans(
                fontSize: 11.5,
                fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                color: isSelected ? const Color(0xFF0D120C) : Colors.white.withValues(alpha: 0.9),
                letterSpacing: 0.2,
              ),
            ),
          ],
        ),
      ),
    );
  }

  // MODERN BUSINESS CARD (BORDERLESS, SOFT ELEVATION)
  Widget _buildBusinessCard(RetailSpace space, int index) {
    final isRetail = space.type == 'Retail';
    return GestureDetector(
      onTap: () => _openDetailModal(space),
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(
          color: ImperialColors.surface,
          borderRadius: BorderRadius.circular(22),
          boxShadow: ImperialTheme.modernCardShadow,
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Stack(
              children: [
                SmartAssetImage(
                  localPath: space.assets.thumbLocalPath,
                  remoteUrl: space.assets.thumbRemoteUrl,
                  height: 185,
                  width: double.infinity,
                ),
                Positioned(
                  top: 12,
                  left: 12,
                  child: StatusBadge(status: space.status, compact: true),
                ),
                Positioned(
                  top: 12,
                  right: 12,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4.5),
                    decoration: BoxDecoration(
                      color: ImperialColors.primary.withValues(alpha: 0.85),
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Text(
                      isRetail ? 'COMMERCE FLAGSHIP' : 'PLATEAU BUREAUX',
                      style: ImperialTheme.bodyStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w700,
                        color: ImperialColors.accentLight,
                      ),
                    ),
                  ),
                ),
                Positioned(
                  bottom: 10,
                  left: 12,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4.5),
                    decoration: BoxDecoration(
                      color: ImperialColors.primary.withValues(alpha: 0.85),
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Text(
                      '${space.surfaceFormatted} • ${space.floorLabel}',
                      style: ImperialTheme.bodyStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ],
            ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          space.title,
                          style: ImperialTheme.displayStyle(fontSize: 16),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4.5),
                        decoration: BoxDecoration(
                          color: ImperialColors.accent.withValues(alpha: 0.16),
                          borderRadius: BorderRadius.circular(999),
                        ),
                        child: Text(
                          'SUR DEMANDE',
                          style: ImperialTheme.bodyStyle(
                            fontSize: 10.5,
                            fontWeight: FontWeight.w700,
                            color: ImperialColors.accentDark,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    space.wingLabel,
                    style: ImperialTheme.bodyStyle(
                      fontSize: 11.5,
                      color: ImperialColors.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 12),
                  // Specifications Badges
                  Wrap(
                    spacing: 8,
                    runSpacing: 6,
                    children: [
                      _specBadge(Icons.straighten_rounded, 'Hauteur: ${space.ceilingHeight}'),
                      if (space.linearFacade.isNotEmpty)
                        _specBadge(Icons.view_carousel_rounded, 'Vitrine: ${space.linearFacade}'),
                      _specBadge(Icons.local_parking_rounded, space.parkingSpots),
                      _specBadge(Icons.air_rounded, 'Extraction IT 246'),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    space.description,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: ImperialTheme.bodyStyle(
                      fontSize: 12,
                      color: ImperialColors.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 14),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          'Idéal: ${space.idealFor}',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: ImperialTheme.bodyStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: ImperialColors.accentDark,
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      GestureDetector(
                        onTap: () => _contactCommerceWhatsApp(space),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: ImperialColors.primary,
                            borderRadius: BorderRadius.circular(999),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(Icons.send_rounded, size: 12, color: ImperialColors.accent),
                              const SizedBox(width: 5),
                              Text(
                                'Contacter',
                                style: ImperialTheme.bodyStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w700,
                                  color: ImperialColors.accent,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    )
        .animate()
        .fadeIn(delay: (index * 60).ms, duration: 320.ms)
        .slideY(begin: 0.05, end: 0);
  }

  Widget _specBadge(IconData icon, String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: ImperialColors.surfaceVariant,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 13, color: ImperialColors.accentDark),
          const SizedBox(width: 4),
          Text(
            text,
            style: ImperialTheme.bodyStyle(
              fontSize: 10.5,
              fontWeight: FontWeight.w600,
              color: ImperialColors.textPrimary,
            ),
          ),
        ],
      ),
    );
  }
}

class _RetailDetailSheet extends StatelessWidget {
  final RetailSpace space;
  final AppState appState;

  const _RetailDetailSheet({required this.space, required this.appState});

  Future<void> _contactWhatsApp(BuildContext context) async {
    final msg =
        'Bonjour BaytImmo, je m\'intéresse à l\'espace commercial ${space.title} (${space.surfaceFormatted} sur Boulevard Menara). Pouvez-vous me communiquer les conditions locatives ou d\'acquisition ?';
    final uri = Uri.parse('https://wa.me/212665644391?text=${Uri.encodeComponent(msg)}');
    await launchUrl(uri, mode: LaunchMode.externalApplication);
  }

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: 0.85,
      maxChildSize: 0.95,
      minChildSize: 0.5,
      builder: (context, scrollCtrl) {
        return Container(
          decoration: const BoxDecoration(
            color: ImperialColors.background,
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          ),
          child: Column(
            children: [
              // Drag Handle
              Container(
                margin: const EdgeInsets.symmetric(vertical: 10),
                width: 42,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey.withValues(alpha: 0.35),
                  borderRadius: BorderRadius.circular(999),
                ),
              ),
              Expanded(
                child: ListView(
                  controller: scrollCtrl,
                  padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
                  children: [
                    // Image with rounded corners
                    ClipRRect(
                      borderRadius: BorderRadius.circular(20),
                      child: SmartAssetImage(
                        localPath: space.assets.thumbLocalPath,
                        remoteUrl: space.assets.thumbRemoteUrl,
                        height: 220,
                        width: double.infinity,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            space.title,
                            style: ImperialTheme.displayStyle(fontSize: 20),
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                          decoration: BoxDecoration(
                            color: ImperialColors.accent.withValues(alpha: 0.16),
                            borderRadius: BorderRadius.circular(999),
                          ),
                          child: Text(
                            'PRIX SUR DEMANDE',
                            style: ImperialTheme.bodyStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                              color: ImperialColors.accentDark,
                            ),
                          ),
                        ),
                      ],
                    ),
                    Text(
                      '${space.surfaceFormatted} • ${space.floorLabel}',
                      style: ImperialTheme.bodyStyle(
                        fontSize: 13,
                        color: ImperialColors.textSecondary,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'DESCRIPTION TECHNIQUE',
                      style: ImperialTheme.bodyStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: ImperialColors.accentDark,
                        letterSpacing: 0.8,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      space.description,
                      style: ImperialTheme.bodyStyle(fontSize: 13, height: 1.5),
                    ),
                    const SizedBox(height: 16),
                    // Plan CAD 2D Preview if available
                    if (space.assets.layoutLocalPath.isNotEmpty) ...[
                      Text(
                        'PLAN D\'IMPLANTATION COMMERCIALE (CAD)',
                        style: ImperialTheme.bodyStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color: ImperialColors.accentDark,
                          letterSpacing: 0.8,
                        ),
                      ),
                      const SizedBox(height: 8),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(16),
                        child: Container(
                          color: Colors.white,
                          padding: const EdgeInsets.all(8),
                          child: SmartAssetImage(
                            localPath: space.assets.layoutLocalPath,
                            remoteUrl: space.assets.layoutRemoteUrl,
                            height: 180,
                            fit: BoxFit.contain,
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),
                    ],
                    // Contact Inquiry Button
                    ElevatedButton.icon(
                      onPressed: () => _contactWhatsApp(context),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: ImperialColors.accent,
                        foregroundColor: ImperialColors.primary,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                      ),
                      icon: const Icon(Icons.send_rounded, color: ImperialColors.primary),
                      label: Text(
                        'CONTACTER LE SERVICE COMMERCIAL',
                        style: ImperialTheme.bodyStyle(
                          fontSize: 12.5,
                          fontWeight: FontWeight.w800,
                          color: ImperialColors.primary,
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
}
