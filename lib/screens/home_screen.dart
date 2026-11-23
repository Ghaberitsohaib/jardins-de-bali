// =========================================================================
// JARDINS DE BALI — ACCUEIL (PRÉSENTATION DU PROJET & ARCHITECTURE)
// Promoter: BaytImmo Groupe Immobilier | Architecte: Cabinet AMA Architecture
// Design: Modern Luxury Real-Estate (Airbnb Luxe / Architectural Digest)
// PRIX SUR DEMANDE • CONTACT WHATSAPP DIRECT • PLANS CAD AMA
// =========================================================================

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/app_models.dart';
import '../state/app_state.dart';
import '../theme/imperial_theme.dart';
import '../widgets/comparator_sheet.dart';
import 'auth_screen.dart';
import 'lot_detail_screen.dart';

class HomeScreen extends StatefulWidget {
  final AppState appState;

  const HomeScreen({super.key, required this.appState});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String _featuredFilter = 'Tous';
  int _expandedAmenityIndex = 0;

  List<ResidenceLot> get _featuredLots {
    final all = widget.appState.allResidences;
    int statusRank(ResidenceLot r) =>
        r.isAvailable ? 0 : (r.status == 'Réservé' ? 1 : 2);

    List<ResidenceLot> pickCategory(String cat, int count) {
      final matching = all.where((r) => r.category == cat).toList()
        ..sort((a, b) => statusRank(a).compareTo(statusRank(b)));
      return matching.take(count).toList();
    }

    if (_featuredFilter == 'Tous') {
      return [
        ...pickCategory('Duplex', 3),
        ...pickCategory('2 Chambres', 3),
        ...pickCategory('1 Chambre', 2),
        ...pickCategory('3 Chambres', 2),
      ];
    }
    return pickCategory(_featuredFilter, 8);
  }

  void _openFavoritesOrComparator(int initialTab) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => ComparatorAndFavoritesSheet(
        appState: widget.appState,
        initialTab: initialTab,
      ),
    );
  }

  Future<void> _contactGeneralWhatsApp() async {
    final uri = Uri.parse(
      'https://wa.me/212665644391?text=${Uri.encodeComponent("Bonjour BaytImmo, je souhaite recevoir la présentation officielle et les disponibilités pour le projet Jardins de Bali Marrakech Menara.")}',
    );
    await launchUrl(uri, mode: LaunchMode.externalApplication);
  }

  Future<void> _contactLotWhatsApp(ResidenceLot lot) async {
    final msg =
        'Bonjour BaytImmo, je souhaite recevoir le dossier, le prix et les disponibilités pour le lot ${lot.title} (${lot.category} de ${lot.surfaceFormatted} au ${lot.floorName}).';
    final uri = Uri.parse('https://wa.me/212665644391?text=${Uri.encodeComponent(msg)}');
    await launchUrl(uri, mode: LaunchMode.externalApplication);
  }

  void _toggleLotFavorite(ResidenceLot lot) {
    HapticFeedback.lightImpact();
    final willBeFav = !widget.appState.isFavorite(lot.id);
    widget.appState.toggleFavorite(lot.id);

    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        duration: const Duration(milliseconds: 1800),
        backgroundColor: ImperialColors.primary,
        behavior: SnackBarBehavior.floating,
        margin: const EdgeInsets.fromLTRB(16, 0, 16, 85),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        content: Row(
          children: [
            Icon(
              willBeFav ? Icons.favorite_rounded : Icons.favorite_border_rounded,
              color: ImperialColors.accent,
              size: 18,
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                willBeFav
                    ? '${lot.title} ajouté à vos favoris'
                    : '${lot.title} retiré de vos favoris',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 12.5,
                  fontWeight: FontWeight.w600,
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
    return ListenableBuilder(
      listenable: widget.appState,
      builder: (context, _) {
        final bundle = widget.appState.bundle;
        if (bundle == null) return const SizedBox.shrink();

        final project = bundle.project;
        final amenities = bundle.amenities;
        final featured = _featuredLots;

        return CustomScrollView(
          slivers: [
            // 1. HERO SHOWCASE SLIVER
            SliverToBoxAdapter(
              child: _buildHeroSection(project),
            ),

            // 2. FEATURED RESIDENCES (FULL-BLEED MODERN CARDS • NO 1PX BOX BORDERS)
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.only(top: 24),
                child: _buildFeaturedSection(featured)
                    .animate()
                    .fadeIn(delay: 150.ms, duration: 450.ms),
              ),
            ),

            // 3. 5-STAR SIGNATURE AMENITIES
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(0, 24, 0, 8),
                child: _buildAmenitiesSection(amenities)
                    .animate()
                    .fadeIn(delay: 240.ms, duration: 450.ms),
              ),
            ),

            // 4. OFFICIAL ARCHITECTURAL PRESENTATION & CAD PLANS (CABINET AMA)
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 20, 16, 175),
                child: _buildArchitecturePresentationCard(project)
                    .animate()
                    .fadeIn(delay: 300.ms, duration: 450.ms)
                    .slideY(begin: 0.06, end: 0),
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildHeroSection(ProjectInfo project) {
    return Container(
      height: 480,
      decoration: const BoxDecoration(
        color: ImperialColors.primary,
        borderRadius: BorderRadius.vertical(bottom: Radius.circular(36)),
      ),
      clipBehavior: Clip.antiAlias,
      child: Stack(
        fit: StackFit.expand,
        children: [
          // Background Architectural Render
          const SmartAssetImage(
            localPath:
                '03_PHOTOS_ET_RENDUS_3D/Exterieurs_Et_Facades/11_facade_ondulante_et_rooftop.jpg',
            fit: BoxFit.cover,
          ),
          // Luxury Smooth Dark Gradient Overlay
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  ImperialColors.primary.withValues(alpha: 0.85),
                  ImperialColors.primary.withValues(alpha: 0.40),
                  ImperialColors.primary.withValues(alpha: 0.98),
                ],
                stops: const [0.0, 0.45, 1.0],
              ),
            ),
          ),
          // Top Bar with Official BaytImmo Logo + WhatsApp VIP & Favorites
          SafeArea(
            bottom: false,
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Top Navigation Header
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // OFFICIAL BAYTIMMO BRAND LOGO
                      const BaytImmoBrandLogo(height: 38, showText: true),
                      // Action Icons
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          GestureDetector(
                            onTap: _contactGeneralWhatsApp,
                            child: Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: ImperialColors.primary.withValues(alpha: 0.85),
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(Icons.chat_bubble_outline_rounded,
                                  size: 15, color: ImperialColors.accent),
                            ),
                          ),
                          const SizedBox(width: 8),
                          GestureDetector(
                            onTap: () => _openFavoritesOrComparator(0),
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 7),
                              decoration: BoxDecoration(
                                color: ImperialColors.primary.withValues(alpha: 0.85),
                                borderRadius: BorderRadius.circular(999),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(
                                    widget.appState.favoriteIds.isNotEmpty
                                        ? Icons.favorite_rounded
                                        : Icons.favorite_border_rounded,
                                    size: 14,
                                    color: widget.appState.favoriteIds.isNotEmpty
                                        ? const Color(0xFFC5A059)
                                        : ImperialColors.accent,
                                  ),
                                  const SizedBox(width: 5),
                                  Text(
                                    '${widget.appState.favoriteIds.length}',
                                    style: ImperialTheme.bodyStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.w700,
                                      color: Colors.white,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          // Espace Client / Admin VIP Portal Button
                          MouseRegion(
                            cursor: SystemMouseCursors.click,
                            child: GestureDetector(
                              onTap: () => AuthScreen.openPortal(context, widget.appState),
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 7),
                                decoration: BoxDecoration(
                                  gradient: widget.appState.isLoggedIn
                                      ? const LinearGradient(
                                          colors: [Color(0xFFE8CC95), Color(0xFFC5A880)],
                                        )
                                      : null,
                                  color: widget.appState.isLoggedIn
                                      ? null
                                      : ImperialColors.primary.withValues(alpha: 0.88),
                                  borderRadius: BorderRadius.circular(999),
                                  border: Border.all(
                                    color: const Color(0xFFDFBA73).withValues(alpha: 0.55),
                                    width: 1,
                                  ),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(
                                      widget.appState.isAdmin
                                          ? Icons.admin_panel_settings_rounded
                                          : Icons.person_outline_rounded,
                                      size: 14,
                                      color: widget.appState.isLoggedIn
                                          ? const Color(0xFF0E140D)
                                          : const Color(0xFFDFBA73),
                                    ),
                                    const SizedBox(width: 5),
                                    Text(
                                      widget.appState.isLoggedIn
                                          ? (widget.appState.isAdmin
                                              ? 'Admin'
                                              : widget.appState.currentUser!.name.split(' ').first)
                                          : 'Espace VIP',
                                      style: ImperialTheme.bodyStyle(
                                        fontSize: 11,
                                        fontWeight: FontWeight.w800,
                                        color: widget.appState.isLoggedIn
                                            ? const Color(0xFF0E140D)
                                            : const Color(0xFFEFD39B),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const Spacer(),
                  // Project Frosted Badge
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6.5),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.14),
                      borderRadius: BorderRadius.circular(999),
                      border: Border.all(
                        color: Colors.white.withValues(alpha: 0.22),
                        width: 1,
                      ),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          width: 6,
                          height: 6,
                          decoration: const BoxDecoration(
                            color: Color(0xFFDFBA73), // Warm Champagne Gold
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'Titre Foncier TF 34 603/M • Quartier Rahham, Menara',
                          style: ImperialTheme.bodyStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: Colors.white,
                            letterSpacing: 0.4,
                          ),
                        ),
                      ],
                    ),
                  )
                      .animate()
                      .fadeIn(duration: 400.ms)
                      .shimmer(delay: 500.ms, duration: 1500.ms),
                  const SizedBox(height: 12),
                  Text.rich(
                    TextSpan(
                      children: [
                        TextSpan(
                          text: 'JARDINS DE BALI\n',
                          style: GoogleFonts.cinzel(
                            fontSize: 27,
                            fontWeight: FontWeight.w700,
                            color: Colors.white,
                            letterSpacing: 3.2,
                            height: 1.25,
                          ),
                        ),
                        TextSpan(
                          text: 'MARRAKECH MENARA',
                          style: GoogleFonts.cinzel(
                            fontSize: 15.5,
                            fontWeight: FontWeight.w700,
                            color: const Color(0xFFC5A880), // Signature Champagne Gold de l'app
                            letterSpacing: 4.5,
                            height: 1.45,
                          ),
                        ),
                      ],
                    ),
                  )
                      .animate()
                      .fadeIn(delay: 80.ms, duration: 400.ms)
                      .slideY(begin: 0.1, end: 0),
                  const SizedBox(height: 10),
                  Text(
                    '230 Résidences d\'exception • Architecture sinusoïdale & Double piscine rooftop 78m',
                    style: ImperialTheme.bodyStyle(
                      fontSize: 12.5,
                      color: Colors.white.withValues(alpha: 0.88),
                      fontWeight: FontWeight.w400,
                      height: 1.35,
                    ),
                  ),
                  const SizedBox(height: 20),
                  // Primary CTA Button — Royal Champagne Gold Luxury Bar (Harmonisé 100% avec les couleurs de l'App)
                  Container(
                    width: double.infinity,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [
                          Color(0xFFDFBA73), // Warm Champagne Gold Highlight
                          Color(0xFFC5A880), // Signature Jardins de Bali Gold
                          Color(0xFFA8895E), // Rich Deep Gold
                        ],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFFC5A880).withValues(alpha: 0.45),
                          blurRadius: 22,
                          offset: const Offset(0, 8),
                        ),
                      ],
                      border: Border.all(
                        color: const Color(0xFFFFE8B8).withValues(alpha: 0.65),
                        width: 1.2,
                      ),
                    ),
                    child: Material(
                      color: Colors.transparent,
                      child: InkWell(
                        borderRadius: BorderRadius.circular(16),
                        onTap: () => widget.appState.setTabIndex(1),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.apartment_rounded,
                                  size: 20, color: Color(0xFF0E130D)),
                              const SizedBox(width: 10),
                              Text(
                                'Explorer les 230 Résidences',
                                style: GoogleFonts.plusJakartaSans(
                                  fontSize: 14.5,
                                  fontWeight: FontWeight.w800,
                                  color: const Color(0xFF0E130D),
                                  letterSpacing: 0.5,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFeaturedSection(List<ResidenceLot> lots) {
    final categories = ['Tous', 'Duplex', '1 Chambre', '2 Chambres', '3 Chambres'];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Sélection Coup de Cœur',
                      style: ImperialTheme.displayStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                        color: ImperialColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Duplexes RDC & Appartements d\'exception',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: ImperialTheme.bodyStyle(
                        fontSize: 11.5,
                        color: ImperialColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              GestureDetector(
                onTap: () => widget.appState.setTabIndex(1),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 6),
                  decoration: BoxDecoration(
                    color: ImperialColors.surfaceVariant,
                    borderRadius: BorderRadius.circular(999),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'Voir tout',
                        style: ImperialTheme.bodyStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: ImperialColors.accentDark,
                        ),
                      ),
                      const SizedBox(width: 3),
                      const Icon(
                        Icons.arrow_forward_ios_rounded,
                        size: 9,
                        color: ImperialColors.accentDark,
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        // Filter Chips
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
          child: Row(
            children: categories.map((cat) {
              return Padding(
                padding: const EdgeInsets.only(right: 8),
                child: ImperialAnimatedChip(
                  label: cat,
                  isSelected: _featuredFilter == cat,
                  onTap: () => setState(() => _featuredFilter = cat),
                ),
              );
            }).toList(),
          ),
        ),
        const SizedBox(height: 16),
        // Modern Horizontal Cards Carousel (NO 1px BORDER FRAMES)
        SizedBox(
          height: 335,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: lots.length,
            itemBuilder: (context, index) {
              final lot = lots[index];
              final isFav = widget.appState.isFavorite(lot.id);
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
                  width: 280,
                  margin: const EdgeInsets.only(right: 14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: ImperialTheme.modernCardShadow,
                  ),
                  clipBehavior: Clip.antiAlias,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Full-bleed Image with subtle bottom gradient & overlay chips
                      Stack(
                        children: [
                          SmartAssetImage(
                            localPath: lot.assets.thumbLocalPath,
                            remoteUrl: lot.assets.thumbRemoteUrl,
                            height: 172,
                            width: double.infinity,
                            fit: BoxFit.cover,
                          ),
                          Positioned.fill(
                            child: DecoratedBox(
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  begin: Alignment.topCenter,
                                  end: Alignment.bottomCenter,
                                  colors: [
                                    Colors.transparent,
                                    Colors.black.withValues(alpha: 0.40),
                                  ],
                                  stops: const [0.65, 1.0],
                                ),
                              ),
                            ),
                          ),
                          // Status Badge
                          Positioned(
                            top: 10,
                            left: 10,
                            child: StatusBadge(status: lot.status, compact: true),
                          ),
                          // Favorite Icon Button (Clean luxury white frosted circle with Ruby Red active heart)
                          Positioned(
                            top: 8,
                            right: 8,
                            child: GestureDetector(
                              behavior: HitTestBehavior.opaque,
                              onTap: () => _toggleLotFavorite(lot),
                              child: Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  shape: BoxShape.circle,
                                  boxShadow: [
                                    BoxShadow(
                                      color: isFav
                                          ? const Color(0xFFC5A059).withValues(alpha: 0.35)
                                          : Colors.black.withValues(alpha: 0.16),
                                      blurRadius: 8,
                                      offset: const Offset(0, 2),
                                    ),
                                  ],
                                ),
                                child: AnimatedScale(
                                  scale: isFav ? 1.10 : 1.0,
                                  duration: const Duration(milliseconds: 200),
                                  curve: Curves.easeOutBack,
                                  child: Icon(
                                    isFav
                                        ? Icons.favorite_rounded
                                        : Icons.favorite_border_rounded,
                                    size: 17,
                                    color: isFav
                                        ? const Color(0xFFC5A059) // Royal Gold (Theme Jardins de Bali)
                                        : const Color(0xFF222820), // Elegant Dark
                                  ),
                                ),
                              ),
                            ),
                          ),
                          // Category and Surface chip
                          Positioned(
                            bottom: 8,
                            left: 10,
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4.5),
                              decoration: BoxDecoration(
                                color: ImperialColors.primary.withValues(alpha: 0.85),
                                borderRadius: BorderRadius.circular(999),
                              ),
                              child: Text(
                                '${lot.displayCategory} • ${lot.surfaceFormatted}',
                                style: ImperialTheme.bodyStyle(
                                  fontSize: 10.5,
                                  fontWeight: FontWeight.w700,
                                  color: ImperialColors.accentLight,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                      // Card Body
                      Padding(
                        padding: const EdgeInsets.all(14),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              lot.title,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: ImperialTheme.displayStyle(
                                fontSize: 15.5,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                            const SizedBox(height: 3),
                            Row(
                              children: [
                                const Icon(Icons.location_on_outlined, size: 12, color: ImperialColors.textMuted),
                                const SizedBox(width: 3),
                                Expanded(
                                  child: Text(
                                    '${lot.floorName} • ${lot.view}',
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: ImperialTheme.bodyStyle(
                                      fontSize: 11.5,
                                      color: ImperialColors.textSecondary,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            // PRIX SUR DEMANDE + DIRECT WHATSAPP ACTION BUTTON
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              crossAxisAlignment: CrossAxisAlignment.center,
                              children: [
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Text(
                                      'CONDITIONS',
                                      style: ImperialTheme.bodyStyle(
                                        fontSize: 9,
                                        fontWeight: FontWeight.w700,
                                        color: ImperialColors.textMuted,
                                        letterSpacing: 0.6,
                                      ),
                                    ),
                                    const SizedBox(height: 1),
                                    Text(
                                      'Prix sur demande',
                                      style: ImperialTheme.displayStyle(
                                        fontSize: 12.5,
                                        fontWeight: FontWeight.w800,
                                        color: ImperialColors.accentDark,
                                      ),
                                    ),
                                  ],
                                ),
                                // Contact Action Button (Obsidian & Gold)
                                GestureDetector(
                                  onTap: () => _contactLotWhatsApp(lot),
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 7),
                                    decoration: BoxDecoration(
                                      color: ImperialColors.primary,
                                      borderRadius: BorderRadius.circular(999),
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        const Icon(Icons.send_rounded, size: 11, color: ImperialColors.accent),
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
                  .slideX(begin: 0.06, end: 0);
            },
          ),
        ),
      ],
    );
  }

  Widget _buildAmenitiesSection(List<Amenity> amenities) {
    if (amenities.isEmpty) return const SizedBox.shrink();

    final safeIndex = _expandedAmenityIndex.clamp(0, amenities.length - 1);
    final active = amenities[safeIndex];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Section Header
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4.5),
                decoration: BoxDecoration(
                  color: ImperialColors.accent.withValues(alpha: 0.18),
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Text(
                  'EXPÉRIENCES & PRIVILÈGES',
                  style: ImperialTheme.bodyStyle(
                    fontSize: 9.5,
                    fontWeight: FontWeight.w700,
                    color: ImperialColors.accentDark,
                    letterSpacing: 0.8,
                  ),
                ),
              ),
              const SizedBox(height: 6),
              Text(
                'Prestations 5 Étoiles',
                style: ImperialTheme.displayStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w800,
                  color: ImperialColors.textPrimary,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                'L\'art de vivre balinais allié au prestige impérial de Marrakech',
                style: ImperialTheme.bodyStyle(
                  fontSize: 12.5,
                  color: ImperialColors.textSecondary,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // 1. Horizontal Amenity Selector Chips
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: List.generate(amenities.length, (index) {
              final a = amenities[index];
              final isSelected = safeIndex == index;
              return Padding(
                padding: const EdgeInsets.only(right: 8),
                child: GestureDetector(
                  onTap: () => setState(() => _expandedAmenityIndex = index),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 220),
                    curve: Curves.easeOutCubic,
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    decoration: BoxDecoration(
                      gradient: isSelected
                          ? const LinearGradient(
                              colors: [
                                Color(0xFFDFBA73), // Warm Champagne Gold
                                Color(0xFFC5A880), // Jardins de Bali Gold
                                Color(0xFFA8895E), // Rich Deep Gold
                              ],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            )
                          : null,
                      color: isSelected ? null : Colors.white,
                      borderRadius: BorderRadius.circular(999),
                      border: Border.all(
                        color: isSelected
                            ? const Color(0xFFFFE8B8).withValues(alpha: 0.7)
                            : const Color(0xFFC5A880).withValues(alpha: 0.22),
                        width: 1,
                      ),
                      boxShadow: isSelected
                          ? [
                              BoxShadow(
                                color: const Color(0xFFC5A880).withValues(alpha: 0.35),
                                blurRadius: 10,
                                offset: const Offset(0, 3),
                              )
                            ]
                          : [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.03),
                                blurRadius: 6,
                                offset: const Offset(0, 2),
                              )
                            ],
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          _iconForAmenity(a.icon),
                          size: 14,
                          color: isSelected ? const Color(0xFF0E130D) : ImperialColors.accentDark,
                        ),
                        const SizedBox(width: 6),
                        Text(
                          _shortTitleForAmenity(a.id, a.title),
                          style: ImperialTheme.bodyStyle(
                            fontSize: 11.5,
                            fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                            color: isSelected ? const Color(0xFF0E130D) : ImperialColors.textPrimary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            }),
          ),
        ),
        const SizedBox(height: 14),

        // 2. Featured Showcase Card (Modern Full-Bleed Photography)
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Container(
            decoration: BoxDecoration(
              color: ImperialColors.surface,
              borderRadius: BorderRadius.circular(24),
              boxShadow: ImperialTheme.modernCardShadow,
            ),
            clipBehavior: Clip.antiAlias,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Amenity Visual Render
                SmartAssetImage(
                  localPath: active.image,
                  height: 155,
                  width: double.infinity,
                  fit: BoxFit.cover,
                ),

                // Card Details Body
                Padding(
                  padding: const EdgeInsets.all(18),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        active.title,
                        style: ImperialTheme.displayStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.w700,
                          color: ImperialColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        active.subtitle,
                        style: ImperialTheme.bodyStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: ImperialColors.accentDark,
                        ),
                      ),
                      const SizedBox(height: 10),
                      Text(
                        active.description,
                        style: ImperialTheme.bodyStyle(
                          fontSize: 12.5,
                          color: ImperialColors.textSecondary,
                          height: 1.55,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  String _shortTitleForAmenity(String id, String fullTitle) {
    if (id.contains('pool')) return 'Double Piscine 78m';
    if (id.contains('patio')) return 'Patio & Fontaine';
    if (id.contains('solarium')) return 'Solarium Lounge';
    if (id.contains('fitness')) return 'Fitness & Yoga';
    if (id.contains('terrasse') || id.contains('gradin')) return 'Terrasses en Gradins';
    if (id.contains('concierge')) return 'Terrasses en Gradins';
    if (id.contains('parking')) return 'Parking Sous-Sol';
    return fullTitle.split(' ').take(2).join(' ');
  }

  IconData _iconForAmenity(String iconName) {
    switch (iconName) {
      case 'pool':
        return Icons.pool_rounded;
      case 'tree':
        return Icons.park_rounded;
      case 'sun':
        return Icons.wb_sunny_rounded;
      case 'fitness':
        return Icons.fitness_center_rounded;
      case 'deck':
      case 'balcony':
      case 'terrasse':
        return Icons.deck_rounded;
      case 'shield':
        return Icons.verified_user_rounded;
      case 'parking':
        return Icons.local_parking_rounded;
      default:
        return Icons.star_rounded;
    }
  }

  /// REPLACEMENT FOR OLD 3D CARD: OFFICIAL ARCHITECTURE & AMA PLANS PRESENTATION
  Widget _buildArchitecturePresentationCard(ProjectInfo project) {
    return Container(
      decoration: BoxDecoration(
        color: ImperialColors.surface,
        borderRadius: BorderRadius.circular(24),
        boxShadow: ImperialTheme.modernCardShadow,
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 1. Top Visual Image with Gradient & Caption
          Stack(
            children: [
              const SmartAssetImage(
                localPath:
                    '03_PHOTOS_ET_RENDUS_3D/Exterieurs_Et_Facades/10_rooftop_piscines_solarium.jpg',
                height: 160,
                width: double.infinity,
                fit: BoxFit.cover,
              ),
              // Subtle Gradient Overlay
              Positioned.fill(
                child: Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Colors.black.withValues(alpha: 0.15),
                        Colors.transparent,
                        Colors.black.withValues(alpha: 0.75),
                      ],
                      stops: const [0.0, 0.5, 1.0],
                    ),
                  ),
                ),
              ),
              // Bottom Floating Caption
              Positioned(
                bottom: 12,
                left: 14,
                right: 14,
                child: Row(
                  children: [
                    const Icon(Icons.wb_sunny_rounded,
                        size: 14, color: ImperialColors.accent),
                    const SizedBox(width: 6),
                    Expanded(
                      child: Text(
                        'Vue panoramique sur la Menara & l\'Atlas',
                        style: ImperialTheme.bodyStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          // 2. Card Content Body
          Padding(
            padding: const EdgeInsets.all(18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Architect Title & Cadastral Reference
                Text(
                  'Cabinet AMA Architecture',
                  style: ImperialTheme.displayStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w800,
                    color: ImperialColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Rabat & Marrakech • Titre Foncier TF 34 603/M (Lot B5)',
                  style: ImperialTheme.bodyStyle(
                    fontSize: 11.5,
                    color: ImperialColors.accentDark,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 12),

                // 3 Highlights Chips
                Row(
                  children: [
                    _highlightChip(Icons.straighten_rounded, '78m Rooftop'),
                    const SizedBox(width: 8),
                    _highlightChip(Icons.waves_rounded, 'Sinusoïdal'),
                    const SizedBox(width: 8),
                    _highlightChip(Icons.verified_rounded, 'Garantie GFA'),
                  ],
                ),
                const SizedBox(height: 12),

                // Clean Editorial Description with proper line height
                Text(
                  'Une conception bioclimatique contemporaine aux façades ondulantes, alliant la sérénité balinaise aux volumes impériaux de Marrakech. 230 résidences de prestige avec loggias et 4 grands magasins flagships (554 m²) au Quartier Rahham, Menara.',
                  style: ImperialTheme.bodyStyle(
                    fontSize: 12,
                    color: ImperialColors.textSecondary,
                    height: 1.5,
                  ),
                ),
                const SizedBox(height: 16),

                // Full-width Sleek CTA Button (Royal Champagne Gold Luxury Bar)
                Container(
                  width: double.infinity,
                  height: 50,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [
                        Color(0xFFDFBA73), // Warm Champagne Gold
                        Color(0xFFC5A880), // Jardins de Bali Gold
                        Color(0xFFA8895E), // Rich Deep Gold
                      ],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFFC5A880).withValues(alpha: 0.45),
                        blurRadius: 18,
                        offset: const Offset(0, 5),
                      ),
                    ],
                    border: Border.all(
                      color: const Color(0xFFFFE8B8).withValues(alpha: 0.65),
                      width: 1,
                    ),
                  ),
                  child: Material(
                    color: Colors.transparent,
                    child: InkWell(
                      borderRadius: BorderRadius.circular(16),
                      onTap: () => widget.appState.setTabIndex(3),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.headset_mic_rounded,
                              size: 19, color: Color(0xFF0E130D)),
                          const SizedBox(width: 8),
                          Text(
                            'Contacter le Bureau de Vente VIP',
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 13,
                              fontWeight: FontWeight.w800,
                              color: const Color(0xFF0E130D),
                              letterSpacing: 0.3,
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
  }

  Widget _highlightChip(IconData icon, String label) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 7),
        decoration: BoxDecoration(
          color: ImperialColors.surfaceVariant,
          borderRadius: BorderRadius.circular(10),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 12, color: ImperialColors.accentDark),
            const SizedBox(width: 4),
            Flexible(
              child: Text(
                label,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: ImperialTheme.bodyStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                  color: ImperialColors.textPrimary,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
