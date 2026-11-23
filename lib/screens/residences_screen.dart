// =========================================================================
// JARDINS DE BALI — TAB 2: RESIDENCES CATALOGUE & FILTERS SCREEN
// Search by lot number ("APP 105"), Typology, Surface slider, Floor, Status
// PRIX SUR DEMANDE • CONTACT WHATSAPP DIRECT SUR CHAQUE LOT
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
import '../widgets/floor_explorer_view.dart';
import 'lot_detail_screen.dart';

class ResidencesScreen extends StatefulWidget {
  final AppState appState;

  const ResidencesScreen({super.key, required this.appState});

  @override
  State<ResidencesScreen> createState() => _ResidencesScreenState();
}

class _ResidencesScreenState extends State<ResidencesScreen> {
  final TextEditingController _searchController = TextEditingController();
  bool _showAdvancedFilters = false;

  @override
  void initState() {
    super.initState();
    _searchController.text = widget.appState.searchQuery;
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _openComparatorSheet(int tab) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => ComparatorAndFavoritesSheet(
        appState: widget.appState,
        initialTab: tab,
      ),
    );
  }

  Future<void> _contactLotWhatsApp(ResidenceLot lot) async {
    final msg =
        'Bonjour BaytImmo, je m\'intéresse au lot ${lot.title} (${lot.category} de ${lot.surfaceFormatted} au ${lot.floorName}). Pouvez-vous me communiquer les disponibilités et les conditions de réservation ?';
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
        final appState = widget.appState;
        final lots = appState.filteredResidences;
        final categories = ['Tous', 'Duplex', '1 Chambre', '2 Chambres', '3 Chambres'];
        final floors = <num?>[null, 0, 1, 2, 3, 4, 5];
        final statuses = ['Tous', 'Disponible', 'Réservé', 'Vendu'];

        return Column(
      children: [
        // 1. LUXURY DARK HEADER + SEARCH + TYPOLOGY CHIPS
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
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Catalogue des Résidences',
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
                            '${lots.length} lots sur 230 • TF 34 603/M',
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 11,
                              fontWeight: FontWeight.w400,
                              color: const Color(0xFFA5B0A2),
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 8),
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        // Compare badge button
                        GestureDetector(
                          onTap: () => _openComparatorSheet(1),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 240),
                            padding: const EdgeInsets.symmetric(
                                horizontal: 9, vertical: 5.5),
                            decoration: BoxDecoration(
                              color: appState.compareIds.isNotEmpty
                                  ? ImperialColors.accent
                                  : Colors.white.withValues(alpha: 0.08),
                              borderRadius: BorderRadius.circular(999),
                              border: Border.all(
                                color: appState.compareIds.isNotEmpty
                                    ? Colors.transparent
                                    : Colors.white.withValues(alpha: 0.12),
                                width: 0.8,
                              ),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  Icons.compare_arrows_rounded,
                                  size: 14,
                                  color: appState.compareIds.isNotEmpty
                                      ? ImperialColors.primary
                                      : ImperialColors.accent,
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  '${appState.compareIds.length}/3',
                                  style: ImperialTheme.bodyStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w700,
                                    color: appState.compareIds.isNotEmpty
                                        ? ImperialColors.primary
                                        : Colors.white,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(width: 6),
                        // Interactive Floor Explorer toggle button
                        GestureDetector(
                          onTap: () => appState.setFloorView(!appState.isFloorView),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 220),
                            padding: const EdgeInsets.symmetric(
                                horizontal: 9, vertical: 6),
                            decoration: BoxDecoration(
                              color: appState.isFloorView
                                  ? ImperialColors.accent
                                  : Colors.white.withValues(alpha: 0.08),
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(
                                color: appState.isFloorView
                                    ? Colors.transparent
                                    : Colors.white.withValues(alpha: 0.12),
                                width: 0.8,
                              ),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  Icons.layers_rounded,
                                  size: 14,
                                  color: appState.isFloorView
                                      ? ImperialColors.primary
                                      : ImperialColors.accent,
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  'Étages',
                                  style: ImperialTheme.bodyStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w700,
                                    color: appState.isFloorView
                                        ? ImperialColors.primary
                                        : Colors.white,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(width: 6),
                        // Grid/List toggle button
                        GestureDetector(
                          onTap: () {
                            if (appState.isFloorView) {
                              appState.setFloorView(false);
                            } else {
                              appState.toggleViewMode();
                            }
                          },
                          child: Container(
                            padding: const EdgeInsets.all(6.5),
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.08),
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(
                                color: Colors.white.withValues(alpha: 0.12),
                                width: 0.8,
                              ),
                            ),
                            child: Icon(
                              appState.isGridView
                                  ? Icons.view_list_rounded
                                  : Icons.grid_view_rounded,
                              color: ImperialColors.accent,
                              size: 18,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                // Search Input Field
                Container(
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.08),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: TextField(
                    controller: _searchController,
                    onChanged: appState.setSearchQuery,
                    style: ImperialTheme.bodyStyle(color: Colors.white),
                    decoration: InputDecoration(
                      hintText: 'Rechercher par n° de lot (ex: "APP 105"), vue, étage...',
                      hintStyle: ImperialTheme.bodyStyle(
                        fontSize: 12.5,
                        color: Colors.white54,
                      ),
                      prefixIcon: const Icon(Icons.search_rounded,
                          color: ImperialColors.accent, size: 20),
                      suffixIcon: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          if (_searchController.text.isNotEmpty)
                            IconButton(
                              icon: const Icon(Icons.close_rounded,
                                  size: 16, color: Colors.white54),
                              onPressed: () {
                                _searchController.clear();
                                appState.setSearchQuery('');
                              },
                            ),
                          IconButton(
                            icon: Icon(
                              _showAdvancedFilters
                                  ? Icons.filter_alt_rounded
                                  : Icons.filter_alt_outlined,
                              color: _showAdvancedFilters
                                  ? ImperialColors.accent
                                  : Colors.white70,
                              size: 20,
                            ),
                            onPressed: () => setState(
                                () => _showAdvancedFilters = !_showAdvancedFilters),
                          ),
                        ],
                      ),
                      border: InputBorder.none,
                      contentPadding: const EdgeInsets.symmetric(
                          horizontal: 14, vertical: 12),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                // Typology Horizontal Chips (Harmonized Luxury Pills with Icons)
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  physics: const BouncingScrollPhysics(),
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  child: Row(
                    children: categories.map((cat) {
                      final icon = switch (cat) {
                        'Tous' => Icons.grid_view_rounded,
                        'Duplex' => Icons.layers_rounded,
                        '1 Chambre' => Icons.king_bed_rounded,
                        '2 Chambres' => Icons.meeting_room_rounded,
                        _ => Icons.home_work_rounded,
                      };
                      final label = switch (cat) {
                        'Tous' => 'Tous (230)',
                        'Duplex' => 'Duplex RDC (32)',
                        '1 Chambre' => '1 Chambre (52)',
                        '2 Chambres' => '2 Chambres (143)',
                        _ => '3 Chambres',
                      };
                      return Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: ImperialAnimatedChip(
                          label: label,
                          icon: icon,
                          isSelected: appState.selectedCategory == cat,
                          darkTheme: true,
                          onTap: () => appState.setSelectedCategory(cat),
                        ),
                      );
                    }).toList(),
                  ),
                ),
                // Advanced Collapsible Filters
                if (_showAdvancedFilters) ...[
                  const SizedBox(height: 14),
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.06),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Floor filter row
                        Row(
                          children: [
                            Text(
                              'Étage :',
                              style: ImperialTheme.bodyStyle(
                                fontSize: 11.5,
                                color: ImperialColors.accentLight,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: SingleChildScrollView(
                                scrollDirection: Axis.horizontal,
                                child: Row(
                                  children: floors.map((f) {
                                    final label = f == null
                                        ? 'Tous'
                                        : (f == 0 ? 'RDC' : 'R+$f');
                                    final isSel = appState.selectedFloor == f;
                                    return Padding(
                                      padding: const EdgeInsets.only(right: 6),
                                      child: GestureDetector(
                                        onTap: () => appState.setSelectedFloor(f),
                                        child: AnimatedContainer(
                                          duration: const Duration(milliseconds: 200),
                                          padding: const EdgeInsets.symmetric(
                                              horizontal: 10, vertical: 5),
                                          decoration: BoxDecoration(
                                            color: isSel
                                                ? ImperialColors.accent
                                                : Colors.white.withValues(alpha: 0.1),
                                            borderRadius:
                                                BorderRadius.circular(8),
                                          ),
                                          child: Text(
                                            label,
                                            style: ImperialTheme.bodyStyle(
                                              fontSize: 11,
                                              fontWeight: isSel
                                                  ? FontWeight.w700
                                                  : FontWeight.w500,
                                              color: isSel
                                                  ? ImperialColors.primary
                                                  : Colors.white,
                                            ),
                                          ),
                                        ),
                                      ),
                                    );
                                  }).toList(),
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        // Status filter row
                        Row(
                          children: [
                            Text(
                              'Statut :',
                              style: ImperialTheme.bodyStyle(
                                fontSize: 11.5,
                                color: ImperialColors.accentLight,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: SingleChildScrollView(
                                scrollDirection: Axis.horizontal,
                                child: Row(
                                  children: statuses.map((st) {
                                    final isSel = appState.selectedStatus == st;
                                    return Padding(
                                      padding: const EdgeInsets.only(right: 6),
                                      child: GestureDetector(
                                        onTap: () => appState.setSelectedStatus(st),
                                        child: AnimatedContainer(
                                          duration: const Duration(milliseconds: 200),
                                          padding: const EdgeInsets.symmetric(
                                              horizontal: 10, vertical: 5),
                                          decoration: BoxDecoration(
                                            color: isSel
                                                ? ImperialColors.accent
                                                : Colors.white.withValues(alpha: 0.1),
                                            borderRadius:
                                                BorderRadius.circular(8),
                                          ),
                                          child: Text(
                                            st,
                                            style: ImperialTheme.bodyStyle(
                                              fontSize: 11,
                                              fontWeight: isSel
                                                  ? FontWeight.w700
                                                  : FontWeight.w500,
                                              color: isSel
                                                  ? ImperialColors.primary
                                                  : Colors.white,
                                            ),
                                          ),
                                        ),
                                      ),
                                    );
                                  }).toList(),
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        // Reset all filters
                        Align(
                          alignment: Alignment.centerRight,
                          child: TextButton.icon(
                            onPressed: () {
                              _searchController.clear();
                              appState.resetFilters();
                            },
                            icon: const Icon(Icons.refresh_rounded,
                                size: 14, color: ImperialColors.accent),
                            label: Text(
                              'Réinitialiser les filtres',
                              style: ImperialTheme.bodyStyle(
                                fontSize: 11.5,
                                color: ImperialColors.accent,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),

        // 2. RESIDENCES FEED (FLOOR EXPLORER, GRID, OR LIST VIEW)
        Expanded(
          child: appState.isFloorView
              ? FloorExplorerView(appState: appState)
              : lots.isEmpty
                  ? Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.search_off_rounded,
                          size: 48, color: ImperialColors.textMuted),
                      const SizedBox(height: 12),
                      Text(
                        'Aucune résidence ne correspond à vos filtres',
                        style: ImperialTheme.displayStyle(fontSize: 16),
                      ),
                      const SizedBox(height: 8),
                      TextButton(
                        onPressed: appState.resetFilters,
                        child: const Text('Réinitialiser les critères'),
                      ),
                    ],
                  ),
                )
              : appState.isGridView
                  ? GridView.builder(
                      padding: const EdgeInsets.fromLTRB(16, 16, 16, 160),
                      itemCount: lots.length,
                      gridDelegate:
                          const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        mainAxisSpacing: 14,
                        crossAxisSpacing: 14,
                        childAspectRatio: 0.70,
                      ),
                      itemBuilder: (context, index) {
                        final lot = lots[index];
                        return _buildGridLotCard(lot, index);
                      },
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.fromLTRB(16, 16, 16, 160),
                      itemCount: lots.length,
                      itemBuilder: (context, index) {
                        final lot = lots[index];
                        return _buildListLotCard(lot, index);
                      },
                    ),
        ),
      ],
        );
      },
    );
  }

  // MODERN GRID CARD (BORDERLESS, DIFFUSED SHADOW, FULL-BLEED)
  Widget _buildGridLotCard(ResidenceLot lot, int index) {
    final isFav = widget.appState.isFavorite(lot.id);
    return GestureDetector(
      onTap: () {
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (_) =>
                LotDetailScreen(lot: lot, appState: widget.appState),
          ),
        );
      },
      child: Container(
        decoration: BoxDecoration(
          color: ImperialColors.surface,
          borderRadius: BorderRadius.circular(20),
          boxShadow: ImperialTheme.modernCardShadow,
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Stack(
                fit: StackFit.expand,
                children: [
                  SmartAssetImage(
                    localPath: lot.assets.thumbLocalPath,
                    remoteUrl: lot.assets.thumbRemoteUrl,
                  ),
                  Positioned(
                    top: 8,
                    left: 8,
                    child: StatusBadge(status: lot.status, compact: true),
                  ),
                  Positioned(
                    top: 6,
                    right: 6,
                    child: GestureDetector(
                      behavior: HitTestBehavior.opaque,
                      onTap: () => _toggleLotFavorite(lot),
                      child: Container(
                        padding: const EdgeInsets.all(7),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(
                              color: isFav
                                  ? const Color(0xFFC5A059).withValues(alpha: 0.35)
                                  : Colors.black.withValues(alpha: 0.16),
                              blurRadius: 6,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: AnimatedScale(
                          scale: isFav ? 1.08 : 1.0,
                          duration: const Duration(milliseconds: 200),
                          child: Icon(
                            isFav
                                ? Icons.favorite_rounded
                                : Icons.favorite_border_rounded,
                            size: 15,
                            color: isFav
                                ? const Color(0xFFC5A059) // Royal Gold
                                : const Color(0xFF222820),
                          ),
                        ),
                      ),
                    ),
                  ),
                  Positioned(
                    bottom: 6,
                    left: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 3.5),
                      decoration: BoxDecoration(
                        color: ImperialColors.primary.withValues(alpha: 0.82),
                        borderRadius: BorderRadius.circular(999),
                      ),
                      child: Text(
                        lot.surfaceFormatted,
                        style: ImperialTheme.bodyStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                          color: ImperialColors.accentLight,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(11),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    lot.title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: ImperialTheme.displayStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  Text(
                    '${lot.category} • ${lot.floorName}',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: ImperialTheme.bodyStyle(
                      fontSize: 11,
                      color: ImperialColors.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: ImperialColors.accent.withValues(alpha: 0.16),
                          borderRadius: BorderRadius.circular(999),
                        ),
                        child: Text(
                          'Prix sur demande',
                          style: ImperialTheme.bodyStyle(
                            fontSize: 9.5,
                            fontWeight: FontWeight.w700,
                            color: ImperialColors.accentDark,
                            letterSpacing: 0.2,
                          ),
                        ),
                      ),
                      GestureDetector(
                        onTap: () => _contactLotWhatsApp(lot),
                        child: Container(
                          padding: const EdgeInsets.all(6),
                          decoration: const BoxDecoration(
                            color: ImperialColors.primary,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.send_rounded,
                            size: 12,
                            color: ImperialColors.accent,
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
        .fadeIn(delay: ((index % 8) * 35).ms, duration: 280.ms)
        .slideY(begin: 0.04, end: 0);
  }

  // MODERN LIST CARD (BORDERLESS, SOFT ELEVATION)
  Widget _buildListLotCard(ResidenceLot lot, int index) {
    final isFav = widget.appState.isFavorite(lot.id);
    return GestureDetector(
      onTap: () {
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (_) =>
                LotDetailScreen(lot: lot, appState: widget.appState),
          ),
        );
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: ImperialColors.surface,
          borderRadius: BorderRadius.circular(20),
          boxShadow: ImperialTheme.modernCardShadow,
        ),
        child: Row(
          children: [
            SmartAssetImage(
              localPath: lot.assets.thumbLocalPath,
              remoteUrl: lot.assets.thumbRemoteUrl,
              width: 105,
              height: 100,
              borderRadius: BorderRadius.circular(16),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      StatusBadge(status: lot.status, compact: true),
                      GestureDetector(
                        behavior: HitTestBehavior.opaque,
                        onTap: () => _toggleLotFavorite(lot),
                        child: Padding(
                          padding: const EdgeInsets.all(4.0),
                          child: Icon(
                            isFav
                                ? Icons.favorite_rounded
                                : Icons.favorite_border_rounded,
                            color: isFav
                                ? const Color(0xFFC5A059) // Royal Gold
                                : ImperialColors.textMuted,
                            size: 20,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    lot.title,
                    style: ImperialTheme.displayStyle(fontSize: 15),
                  ),
                  Text(
                    '${lot.surfaceFormatted} • ${lot.floorName}',
                    style: ImperialTheme.bodyStyle(
                      fontSize: 11.5,
                      color: ImperialColors.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4.5),
                        decoration: BoxDecoration(
                          color: ImperialColors.accent.withValues(alpha: 0.16),
                          borderRadius: BorderRadius.circular(999),
                        ),
                        child: Text(
                          'Prix sur demande',
                          style: ImperialTheme.bodyStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            color: ImperialColors.accentDark,
                            letterSpacing: 0.3,
                          ),
                        ),
                      ),
                      GestureDetector(
                        onTap: () => _contactLotWhatsApp(lot),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                          decoration: BoxDecoration(
                            color: ImperialColors.primary,
                            borderRadius: BorderRadius.circular(999),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(Icons.send_rounded, size: 11, color: ImperialColors.accent),
                              const SizedBox(width: 4),
                              Text(
                                'Contacter',
                                style: ImperialTheme.bodyStyle(
                                  fontSize: 10.5,
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
        .fadeIn(delay: ((index % 8) * 35).ms, duration: 280.ms)
        .slideX(begin: 0.04, end: 0);
  }
}
